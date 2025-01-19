import { BarChart, LineChart } from "@mui/x-charts";
import FiltersPane from "../components/FiltersPane";
import { useEffect, useState } from "react";
import axios from "axios";
import {} from "@mui/icons-material";
import DataCard from "../components/DataCard";
import StandardMenu from "../components/StandardMenu";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import NavPane from "../components/NavPane/NavPane";

export type DataOverviewPageProps = {};

export const COUNTRY_TO_ABBRV: { [key: string]: string } = {
  US: "United States",
  JPN: "Japan",
  CHN: "China",
  IND: "India",
  FRA: "France",
  BRA: "Brazil",
};

export default function OverviewPage() {
  const [country, setCountry] = useState<string>("US");
  const [metaData, setMetaData] = useState<any>(null);
  const [emissionsData, setEmissionsData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Retrieves emissions data for the United States by default
    const fetchData = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(
          `https://api.worldbank.org/v2/country/${country}/indicator/EN.GHG.ALL.MT.CE.AR5?format=json`
        );
        console.log(response.data);

        if (response.data[0].message) {
          setError(response.data[0].message);
        } else {
          setEmissionsData(response.data[1]);
          setMetaData(response.data[0]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [country]);

  const setXAxisLabels = () => {
    if (emissionsData) {
      return emissionsData.reverse().map((dataEntry: any) => dataEntry.date);
    }
  };

  const setDataValues = () => {
    if (emissionsData) {
      // Returns the the data values for the past years
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
      <div style={{ margin: "4rem 5rem", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              alignItems: "center",
              flexWrap: "nowrap",
              display: "flex",
            }}
          >
            <h1 style={{ color: "#022d5b" }}>
              Greenhouse Gas Emissions in{" "}
              <span style={{ color: "#f5c504" }}>
                {COUNTRY_TO_ABBRV[country]}
              </span>
            </h1>
            <span style={{ marginLeft: ".25rem" }}>
              <StandardMenu
                label={"Select a Country"}
                options={["US", "JPN", "CHN", "IND", "FRA", "BRA"]}
                setOption={setCountry}
              />
            </span>
          </div>
        </div>
        {/* <FiltersPane /> */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <div style={{ color: "grey" }}>
              Last updated: {metaData.lastupdated}
            </div>
            <div>
              <div
                style={{
                  justifyContent: "space-evenly",
                  display: "flex",
                  width: "100%",
                  marginTop: "3rem",
                }}
              >
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
                  insight={"45% increase from 2023"}
                />
              </div>
              {emissionsData !== null && (
                <div style={{ display: "flex", marginTop: "6rem" }}>
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
                        max: 16000,
                      },
                    ]}
                    series={setDataValues()}
                    width={800}
                    height={400}
                  />
                  {/* <LineChart
              xAxis={[
                { scaleType: "band", data: setXAxisLabels(), label: "Year" },
              ]}
              yAxis={[
                {
                  max: 8000,
                },
              ]}
              series={setDataValues()}
              width={500}
              height={300}
            /> */}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
