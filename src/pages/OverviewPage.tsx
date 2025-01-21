import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import DataCard from "../components/DataCard";
import NavPane from "../components/NavPane/NavPane";
import StandardMenu from "../components/StandardMenu";
import { ABBRV_TO_COUNTRY, COUNTRIES_ABBREV } from "../utils/constants";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";

export type DataOverviewPageProps = {};

export default function OverviewPage() {
  const [country, setCountry] = useState<string>("US");
  const [metaData, setMetaData] = useState<any>(null);
  const [emissionsData, setEmissionsData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Retrieves emissions data on page load
    const fetchEmissionsData = async () => {
      try {
        setLoading(true);
        const response = await getAllEmissionsByCountry(country);

        if (response.data[0].message) {
          setError(response.data[0].message);
        } else {
          setEmissionsData(response.data[1]);
          setMetaData(response.data[0]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmissionsData();
  }, [country]);

  // Returns a list of the range of years for the dataset
  const setXAxisLabels = () => {
    return emissionsData.reverse().map((dataEntry: any) => dataEntry.date);
  };

  // Returns a list containing only the data values
  const setDataValues = () => {
    if (emissionsData) {
      // Returns the the data values for x years
      return [
        {
          data: emissionsData
            .reverse()
            .map((dataEntry: any) => dataEntry.value),
        },
      ];
    } else {
      // Fallback for if there's no data to display
      return [{ data: [] }];
    }
  };

  const hasEmissionsValue = (dataEntry: any) => {
    return dataEntry.value === null;
  };

  // Returns the sum of emissions for a given dataset
  const determineTotalEmissions = () => {
    return Math.round(
      emissionsData
        .filter((dataEntry: any) => dataEntry.value !== null)
        .reduce(
          (accumulator: number, currentValue: any) =>
            accumulator + currentValue.value,
          0
        )
    );
  };

  // Returns the % change of emissions from the latest and first year od recorded emissions
  const determinePercentChangeOfEmissions = () => {
    const data = emissionsData.filter(
      (dataEntry: any) => dataEntry.value !== null
    );
    let latestYear = data[0].value;
    let firstYear = data[data.length - 1].value;
    const difference = latestYear - firstYear;

    const result = (difference / firstYear) * 100;

    return Math.round(result * 10) / 10;
  };

  // Returns the year with the highest recorded emissions
  const findHighestYearOfEmissions = () => {
    return emissionsData.reduce((highestYear: any, currentYear: any) => {
      if (currentYear.value === null) return highestYear;

      return highestYear.value !== null && highestYear.value > currentYear.value
        ? highestYear
        : currentYear;
    });
  };

  return (
    <>
      <NavPane />
      <div className="page-container width-100">
        <div className="width-100 display-flex align-center">
          <h1 style={{ color: "#022d5b" }}>
            Greenhouse Gas Emissions in{" "}
            <span className="color-accent">{ABBRV_TO_COUNTRY[country]}</span>
          </h1>
          <span style={{ marginLeft: ".25rem" }}>
            <StandardMenu
              label={"Change Country"}
              options={COUNTRIES_ABBREV}
              setOption={setCountry}
            />
          </span>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <div className="page-sub-header">
              Explore the trends and patterns in greenhouse gas emissions for{" "}
              {ABBRV_TO_COUNTRY[country]}. Discover total emissions over time,
              review peak years, and understand recent changes. This data was
              last updated by the World Bank on: {metaData.lastupdated}
            </div>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
              <div className="display-flex justify-space-between width-100">
                <DataCard
                  value={determineTotalEmissions()}
                  label={"Total greenhouse emissions"}
                  insight={"From Startdate - Enddate"}
                />
                <DataCard
                  value={findHighestYearOfEmissions().date}
                  label={"Highest recorded greenhouse emissions in a year"}
                  insight={`${findHighestYearOfEmissions().value} Mt CO2e`}
                />
                <DataCard
                  value={determinePercentChangeOfEmissions()}
                  label={"% change of emissions from StartDate - EndDate"}
                />
              </div>
            </div>
            {emissionsData !== null && (
              <div className="mt-3rem">
                <div className="display-flex flex-dir-col align-center">
                  <h3 className="color-primary">
                    Historical Greenhouse Gas Emissions by Year (Mt CO2e)
                  </h3>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: setXAxisLabels(),
                        label: "Year",
                        colorMap: { type: "ordinal", colors: ["#94B4CC"] },
                      },
                    ]}
                    yAxis={[
                      {
                        // max: 16000
                      },
                    ]}
                    series={setDataValues()}
                    width={800}
                    height={400}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// {
//   /* <LineChart
//               xAxis={[
//                 { scaleType: "band", data: setXAxisLabels(), label: "Year" },
//               ]}
//               yAxis={[
//                 {
//                   max: 8000,
//                 },
//               ]}
//               series={setDataValues()}
//               width={500}
//               height={300}
//             /> */
// }
