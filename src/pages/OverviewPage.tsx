import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import DataCard from "../components/DataCard";
import NavPane from "../components/NavPane/NavPane";
import StandardMenu from "../components/mui/StandardMenu";
import {
  EmissionsDataResponseAndCountry
} from "../types/EmissionsData";
import { ABBRV_TO_COUNTRY, COUNTRIES_ABBREV } from "../utils/constants";
import {
  calculateAverageEmissions,
  determinePercentChangeOfEmissions,
  determineTotalEmissions,
  findHighestYearOfEmissions,
  getValuesFromData,
} from "../utils/emissionsDataProcessing";

export default function OverviewPage() {
  const [currentCountry, setCurrentCountry] = useState<string>("US");
  const [emissionsDataResponses, setEmissionsDataResponses] = useState<
    EmissionsDataResponseAndCountry[] | null
  >(null);
  const [countryData, setCountryData] =
    useState<EmissionsDataResponseAndCountry | null>(null);
  const [averageEmissions, setAverageEmissions] = useState<(number | null)[]>(
    []
  );
  const [years, setYears] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all emissions data on mount
  useEffect(() => {
    const fetchAllEmissionsData = async () => {
      try {
        setLoading(true);
        const newData: EmissionsDataResponseAndCountry[] = [];

        for (const country of COUNTRIES_ABBREV) {
          try {
            const response = await getAllEmissionsByCountry(country);

            if (response.data[0].message) {
              console.warn(`Error for ${country}:`, response.data[0].message);
            } else {
              newData.push({ country, data: response.data });
            }
          } catch (error: any) {
            console.error(`Error fetching ${country}:`, error.message);
          }
        }

        setEmissionsDataResponses(newData);

        // Calculate average emissions line
        const { averages, allYears } = calculateAverageEmissions(newData);
        setAverageEmissions(averages);
        setYears(allYears);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmissionsData();
  }, []);

  // Update countryData when currentCountry changes
  useEffect(() => {
    if (emissionsDataResponses) {
      const data = emissionsDataResponses.find(
        (item) => item.country === currentCountry
      );
      setCountryData(data || null);
    }
  }, [currentCountry, emissionsDataResponses]);

  const lastUpdated = countryData?.data[0]?.lastupdated || "Unknown";

  const totalEmissions = countryData
    ? determineTotalEmissions(countryData.data[1])
    : -1;

  const highestYear = countryData
    ? findHighestYearOfEmissions(countryData.data[1])
    : { year: -1, value: -1 };

  const percentChange = countryData
    ? determinePercentChangeOfEmissions(countryData.data[1])
    : { change: -1, isPositive: false };

  const countryValues = countryData
    ? getValuesFromData([countryData as EmissionsDataResponseAndCountry])?.[0]
        .data
    : [];

  return (
    <>
      <NavPane />
      <div className="page-container width-100">
        <div className="width-100 display-flex align-center">
          <h1 style={{ color: "#022d5b" }}>
            Greenhouse Gas Emissions in{" "}
            <span className="color-accent">
              {ABBRV_TO_COUNTRY[currentCountry]}
            </span>
          </h1>
          <span style={{ marginLeft: ".25rem" }}>
            <StandardMenu
              label={"Change Country"}
              options={COUNTRIES_ABBREV}
              setOption={setCurrentCountry}
            />
          </span>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className="page-sub-header">
              Explore the trends and patterns in greenhouse gas emissions for{" "}
              {ABBRV_TO_COUNTRY[currentCountry]}. Discover total emissions over
              time, review peak years, and understand recent changes. This data
              was last updated by the World Bank on: {lastUpdated}
            </div>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
              <div className="display-flex justify-space-between width-100">
                <DataCard
                  value={`${percentChange?.change}% ${
                    percentChange?.isPositive ? "Increase" : "Decrease"
                  }`}
                  label={`Change in emissions from ${years[0]} - ${
                    years[years.length - 1]
                  }`}
                />
                <DataCard
                  value={totalEmissions!.toLocaleString("en-US")}
                  label={"Total greenhouse emissions"}
                  insight={`From ${years[0]} - ${years[years.length - 1]}`}
                />
                <DataCard
                  value={`${highestYear?.value.toLocaleString("en-US")}`}
                  label={"Highest recorded greenhouse emissions"}
                  insight={`(Year: ${highestYear?.year})`}
                />
              </div>
            </div>
            {countryValues && (
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
                    series={[
                      {
                        label: ABBRV_TO_COUNTRY[currentCountry],
                        data: countryValues,
                      },
                      {
                        label: "Global Average",
                        data: averageEmissions,
                      },
                    ]}
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
