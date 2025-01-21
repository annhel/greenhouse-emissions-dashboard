import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import FiltersPane from "../components/FiltersPane";
import NavPane from "../components/NavPane/NavPane";
import { EmissionsDataResponseAndCountry } from "../types/EmissionsData";

export default function ComparePage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [emissionsData, setEmissionsData] = useState<
    EmissionsDataResponseAndCountry[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmissionsData = async () => {
      try {
        setLoading(true);

        const newData: EmissionsDataResponseAndCountry[] = [];

        for (const country of countries) {
          // Skips if that country's data has already been fetched
          if (emissionsData.find((data) => data.country === country)) {
            continue;
          }

          try {
            const response = await getAllEmissionsByCountry(country);

            if (response.data[0].message) {
              throw new Error(response.data[0].message);
            } else {
              newData.push({ country, data: response.data });
            }
          } catch (countryError: any) {
            console.error(
              `Error fetching data for ${country}:`,
              countryError.message
            );
            setError(countryError.message);
          }
        }

        setEmissionsData((prev) => [...prev, ...newData]);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (countries.length >= 1) {
      fetchEmissionsData();
    }
  }, [countries, years]);

  return (
    <>
      <NavPane />
      <div className="page-container width-100">
        <h1 className="color-primary">Compare Greenhouse Gas Emissions</h1>

        <div className="page-sub-header">
          Compare greenhouse gas emissions between countries and over time.
          Select countries and time ranges to visualize trends and differences
          in emissions.
        </div>
        <FiltersPane
          countries={countries}
          setCountries={setCountries}
          setYears={setYears}
        />
        {countries.length < 2 ? (
          <p
            style={{
              justifySelf: "center",
              color: "grey",
              fontSize: "20px",
              marginTop: "4rem",
            }}
          >
            Select at least two countries to begin visualizing!{" "}
          </p>
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
            </div>
            <div>
              //
              <BarChart
                xAxis={[{ scaleType: "band", data: [], label: "Year" }]}
                yAxis={[
                  {
                    max: 8000,
                  },
                ]}
                series={[{ data: [] }]}
                width={500}
                height={300}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
