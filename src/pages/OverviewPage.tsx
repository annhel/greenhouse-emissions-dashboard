import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import DataCard from "../components/DataCard";
import NavPane from "../components/NavPane/NavPane";
import StandardMenu from "../components/StandardMenu";
import { EmissionsDataResponse } from "../types/EmissionsData";
import { ABBRV_TO_COUNTRY, COUNTRIES_ABBREV } from "../utils/constants";
import {
  determinePercentChangeOfEmissions,
  determineTotalEmissions,
  findHighestYearOfEmissions,
} from "../utils/emissionsDataProcessing";

export type DataOverviewPageProps = {};

export default function OverviewPage() {
  const [country, setCountry] = useState<string>("US");
  const [emissionsData, setEmissionsData] =
    useState<EmissionsDataResponse | null>(null);

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const emissionsDataIsNullOrUndefined =
    emissionsData === null || emissionsData === undefined;

  useEffect(() => {
    // Retrieves emissions data on page load
    const fetchEmissionsData = async () => {
      try {
        setLoading(true);
        const response = await getAllEmissionsByCountry(country);

        if (response.data[0].message) {
          setError(response.data[0].message);
        } else {
          setEmissionsData(response.data);
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
    if (emissionsDataIsNullOrUndefined) {
      return [];
    } else {
      return emissionsData[1].reverse().map((dataEntry: any) => dataEntry.date);
    }
  };

  // Returns a list containing only the data values
  const setDataValues = () => {
    if (!emissionsDataIsNullOrUndefined) {
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
        {emissionsDataIsNullOrUndefined ? (
          <p>
            Sorry there was an error retrieving data, please refresh and try
            again.
          </p>
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <div className="page-sub-header">
              Explore the trends and patterns in greenhouse gas emissions for{" "}
              {ABBRV_TO_COUNTRY[country]}. Discover total emissions over time,
              review peak years, and understand recent changes. This data was
              last updated by the World Bank on: {emissionsData[0].lastupdated}
            </div>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
              <div className="display-flex justify-space-between width-100">
                <DataCard
                  value={determineTotalEmissions(emissionsData[1])}
                  label={"Total greenhouse emissions"}
                  insight={"From Startdate - Enddate"}
                />
                <DataCard
                  value={findHighestYearOfEmissions(emissionsData[1])!.date}
                  label={"Highest recorded greenhouse emissions in a year"}
                  insight={`${
                    findHighestYearOfEmissions(emissionsData[1])!.value
                  } Mt CO2e`}
                />
                <DataCard
                  value={determinePercentChangeOfEmissions(emissionsData[1])!}
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
                  <LineChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: setXAxisLabels(),
                        label: "Year",
                        // colorMap: { type: "ordinal", colors: ["#94B4CC"] },
                      },
                    ]}
                    yAxis={[
                      {
                        // max: 16000
                      },
                    ]}
                    series={setDataValues()}
                    width={1200}
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
