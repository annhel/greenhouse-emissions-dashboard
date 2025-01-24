import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import CompareTable from "../components/CompareTable";
import FiltersPane from "../components/FiltersPane";
import NavPane from "../components/NavPane/NavPane";
import { EmissionsDataResponseAndCountry } from "../types/EmissionsData";
import {
  determineTableDataStatistics,
  getValuesFromData,
  updateTableDataWithStack,
} from "../utils/emissionsDataProcessing";
import { range } from "../utils/helpers";

export default function ComparePage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([1974, 2022]);
  const [emissionsDataResponses, setEmissionsDataResponses] = useState<
    EmissionsDataResponseAndCountry[]
  >([]);

  const [chartValues, setChartValues] = useState<any>([]);
  const [tableData, setTableData] = useState<any>(
    determineTableDataStatistics(emissionsDataResponses, years)
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetches global emissions data
  useEffect(() => {
    const fetchEmissionsData = async () => {
      try {
        setLoading(true);

        const newData: EmissionsDataResponseAndCountry[] = [];

        for (const country of countries) {
          // Skips if that country's data has already been fetched
          if (emissionsDataResponses.find((data) => data.country === country)) {
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

        setEmissionsDataResponses((prev) => [...prev, ...newData]);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Fetches data when:
    //  1) 2+ countries have been selected
    //  2) More countries have been selected, than there has been retrieved
    if (
      countries.length >= 2 &&
      countries.length > emissionsDataResponses.length
    ) {
      fetchEmissionsData();
    }

    if (countries.length < emissionsDataResponses.length) {
      setEmissionsDataResponses((prev) =>
        prev.filter((res) => countries.includes(res.country))
      );
    }
  }, [countries]);

  // Updates chart and table values if the years or emissionsdata gets updated
  useEffect(() => {
    setChartValues(
      getValuesFromData(
        emissionsDataResponses as EmissionsDataResponseAndCountry[],
        years as number[]
      )
    );

    setTableData(determineTableDataStatistics(emissionsDataResponses, years));
  }, [years, emissionsDataResponses]);

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
          years={years}
          setYears={setYears}
        />
        {countries.length < 2 ? (
          <p
            style={{
              justifySelf: "center",
              color: "grey",
              fontSize: "20px",
              marginTop: "8rem",
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

            <div className="display-flex align-center justify-space-between flex-dir-col mt-3rem">
              <h3 className="color-primary">
                Greenhouse Gas Emissions: Percent Change and Contributions
              </h3>
              <CompareTable tableData={tableData} />
            </div>

            <div className="display-flex flex-dir-col align-center mt-3rem">
              <h3 className="color-primary">
                Yearly Greenhouse Gas Emissions by Country (Mt CO2e)
              </h3>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: range(years[0], years[1], 1),
                    label: "Year",
                  },
                ]}
                series={chartValues}
                width={1200}
                height={400}
              />
            </div>
            <div className="display-flex flex-dir-col align-center mt-3rem">
              <h3 className="color-primary">
                Cumulative Greenhouse Gas Emissions by Country (Mt CO2e)
              </h3>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: range(years[0], years[1], 1),
                    label: "Year",
                  },
                ]}
                width={1200}
                height={400}
                series={updateTableDataWithStack(chartValues)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

const pieParams = {
  height: 200,
  margin: { right: 5 },
  slotProps: { legend: { hidden: true } },
};
