import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { getAllEmissionsByCountry } from "../api/WorldBankApi";
import CompareTable from "../components/CompareTable";
import FiltersPane from "../components/FiltersPane";
import NavPane from "../components/NavPane/NavPane";
import { EmissionsDataResponseAndCountry } from "../types/EmissionsData";
import {
  determinePercentChangeOfEmissions,
  determineTotalEmissions,
  getValuesFromData,
  updateTableDataWithStack,
} from "../utils/emissionsDataProcessing";
import { range } from "../utils/helpers";

export default function ComparePage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([1974, 2023]);
  const [emissionsDataResponses, setEmissionsDataResponses] = useState<
    EmissionsDataResponseAndCountry[]
  >([]);

  const [chartValues, setChartValues] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    setChartValues(
      getValuesFromData(
        emissionsDataResponses as EmissionsDataResponseAndCountry[],
        years as number[]
      )
    );
  }, [years]);

  // Triggers upon changes to the fetched emissions data
  useEffect(() => {
    setChartValues(
      getValuesFromData(
        emissionsDataResponses as EmissionsDataResponseAndCountry[]
      )
    );
  }, [emissionsDataResponses]);

  const dataArray = emissionsDataResponses.map(
    (res: EmissionsDataResponseAndCountry) => {
      return {
        label: res.country,
        value: determineTotalEmissions(res.data[1]) as number,
      };
    }
  );

  const valueAsPercentTotal = (aggregatedData: any) => {
    const total = dataArray.reduce((sum, currentValue) => {
      return sum + (currentValue.value as number);
    }, 0);

    const result = (aggregatedData.value / total) * 100;

    return Math.round(result * 10) / 10;
  };

  const totalAggregatedEmissions = emissionsDataResponses.reduce(
    (sum, res) => sum + (determineTotalEmissions(res.data[1]) as number),
    0
  );

  // const[tableData, setTableData]  = useState<any>()

  const determineTableDataStatistics = () => {

  }

  const tableData = emissionsDataResponses.map((res) => {
    const percentChange = determinePercentChangeOfEmissions(res.data[1]);
    const totalEmissions = determineTotalEmissions(res.data[1]);
    const percentageOfTotal = totalEmissions
      ? Math.round((totalEmissions / totalAggregatedEmissions) * 100 * 10) / 10
      : null;
  
    return {
      country: res.country,
      percentChange: percentChange,
      totalEmissions: totalEmissions,
      percentageOfTotal: percentageOfTotal,
    };
  });

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

            <div className="display-flex align-center justify-space-between">
              <div>
                <Typography>
                Greenhouse Gas Emissions: Percent Change and Contributions
                </Typography>
                <CompareTable tableData={tableData} />
              </div>
            </div>

            <div className="display-flex flex-dir-col align-center">
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
            <div className="display-flex flex-dir-col align-center">
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
