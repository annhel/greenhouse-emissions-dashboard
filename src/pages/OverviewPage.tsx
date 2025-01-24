import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import DataCard from "../components/DataCard";
import NavPane from "../components/NavPane/NavPane";
import StandardMenu from "../components/StandardMenu";
import {
  EmissionsData,
  EmissionsDataResponseAndCountry,
} from "../types/EmissionsData";
import { ABBRV_TO_COUNTRY, COUNTRIES_ABBREV } from "../utils/constants";
import {
  determinePercentChangeOfEmissions,
  determineTotalEmissions,
  findHighestYearOfEmissions,
  getValuesFromData,
  getYearsFromData,
} from "../utils/emissionsDataProcessing";

export default function OverviewPage() {
  const [country, setCountry] = useState<string>("US");
  const [emissionsDataResponse, setEmissionsDataResponse] =
    useState<EmissionsDataResponseAndCountry | null>(null);

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const emissionsDataIsNullOrUndefined =
    emissionsDataResponse === null || emissionsDataResponse === undefined;

  useEffect(() => {
    // Retrieves emissions data on page load
    const fetchEmissionsData = async () => {
      try {
        setLoading(true);
        const response = await getAllEmissionsByCountry(country);

        if (response.data[0].message) {
          setError(response.data[0].message);
        } else {
          setEmissionsDataResponse({ country, data: response.data });
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmissionsData();
  }, [country]);

  const lastUpdated = emissionsDataResponse?.data[0]?.lastupdated || "Unknown";
  const emissionsData = (emissionsDataResponse?.data[1] ||
    []) as EmissionsData[];

  const totalEmissions = determineTotalEmissions(emissionsData) || -1;
  const highestYear = findHighestYearOfEmissions(emissionsData) || {
    year: -1,
    value: -1,
  };
  const percentChange = determinePercentChangeOfEmissions(emissionsData) || {
    change: -1,
    isPositive: false,
  };
  const years = getYearsFromData(emissionsData) || [];
  const values =
    getValuesFromData([
      emissionsDataResponse as EmissionsDataResponseAndCountry,
    ]) || [];

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
              last updated by the World Bank on: {lastUpdated}
            </div>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
              <div className="display-flex justify-space-between width-100">
                <DataCard
                  value={`${percentChange.change}% ${
                    percentChange.isPositive ? "Increase" : "Decrease"
                  }`}
                  label={`Change in emissions from ${years[0]} - ${
                    years[years.length - 1]
                  }`}
                />
                <DataCard
                  value={totalEmissions.toLocaleString("en-US")}
                  label={"Total greenhouse emissions"}
                  insight={`From ${years[0]} - ${years[years.length - 1]}`}
                />
                <DataCard
                  value={`${highestYear?.value.toLocaleString("en-US")}`}
                  label={"Highest recorded greenhouse emissions"}
                  insight={`(Year: ${highestYear.year})`}
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
                        data: years,
                        label: "Year",
                      },
                    ]}
                    series={values}
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
