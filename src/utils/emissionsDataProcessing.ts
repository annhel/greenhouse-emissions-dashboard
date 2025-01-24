import {
  EmissionsData,
  EmissionsDataResponseAndCountry,
} from "../types/EmissionsData";
import { ABBRV_TO_COUNTRY } from "./constants";

// Returns the sum of emissions for a given dataset
// OPTIONAL: Provide a date range to limit the results
export const determineTotalEmissions = (
  emissionsData: EmissionsData[],
  range?: number[]
): number | null => {
  if (!emissionsData) {
    console.warn("No emissions data provided.");
    return null;
  }

  let validData = emissionsData.filter(
    (dataEntry: EmissionsData) => dataEntry.value !== null
  );

  if (range) {
    validData = validData.filter(
      (dataEntry) =>
        range[0] <= Number(dataEntry.date) && range[1] >= Number(dataEntry.date)
    );
  }

  return Math.round(
    validData.reduce((sum, currentValue) => {
      return sum + (currentValue.value as number);
    }, 0)
  );
};

// Returns the % change of emissions from the latest and first year od recorded emissions
// OPTIONAL: Provide a date range to limit the results
export const determinePercentChangeOfEmissions = (
  emissionsData: EmissionsData[],
  range?: number[]
) => {
  let validData = emissionsData.filter((dataEntry) => dataEntry.value !== null);

  if (validData.length < 2) {
    console.warn("Not enough data to calculate percent change.");
    return null;
  }

  if (range) {
    validData = validData.filter(
      (dataEntry) =>
        range[0] <= Number(dataEntry.date) && range[1] >= Number(dataEntry.date)
    );
  }

  const latestYear = validData[0].value as number;
  const firstYear = validData[validData.length - 1].value as number;

  const difference = latestYear - firstYear;
  const result = (difference / firstYear) * 100;

  return {
    change: Math.round(result * 10) / 10,
    isPositive: result >= 0,
  };
};

// Returns the year with the highest recorded emissions
export const findHighestYearOfEmissions = (
  emissionsData: EmissionsData[]
): { year: string; value: number } | null => {
  if (emissionsData.length === 0) {
    console.warn("No emissions data provided.");
    return null;
  }

  const validData = emissionsData.filter(
    (dataEntry): dataEntry is EmissionsData & { value: number } =>
      dataEntry.value !== null
  );

  if (validData.length === 0) {
    console.warn("No valid emissions data available.");
    return null;
  }

  const highestEntry = validData.reduce((highest, current) => {
    if (current.value === null) return highest;

    return highest && highest.value > current.value ? highest : current;
  });

  // Return only the desired fields
  return {
    year: highestEntry.date,
    value: Number(highestEntry.value.toFixed(1)),
  };
};

// Maps over emissions data and returns an array of all the years in the data
export const getYearsFromData = (
  emissionsData: EmissionsData[]
): string[] | null => {
  if (!emissionsData || emissionsData.length === 0) {
    return null;
  }

  return emissionsData
    .map((dataEntry) => dataEntry.date)
    .sort((a, b) => Number(a) - Number(b));
};

// Maps over emissions data responses and returns an array of all the emission values
// OPTIONAL: Provide a date range to limit the results
export const getValuesFromData = (
  emissionsDataRes: EmissionsDataResponseAndCountry[],
  range?: number[]
) => {
  if (!emissionsDataRes) {
    return null;
  }

  const dataArray = emissionsDataRes.map(
    (res: EmissionsDataResponseAndCountry) => {
      if (res?.data == null) {
        return { label: res.country, data: [] };
      }

      // Sort the data by date in ascending order
      const sortedData = res.data[1]
        .slice()
        .sort((a, b) => Number(a.date) - Number(b.date));

      let emissionValues: number[] = [];
      if (range) {
        emissionValues = sortedData
          .filter(
            (dataEntry: any) =>
              range[0] <= Number(dataEntry.date) &&
              range[1] >= Number(dataEntry.date)
          )
          .map((dataEntry: any) => dataEntry.value);
      } else {
        emissionValues = sortedData.map((dataEntry: any) => dataEntry.value);
      }

      return { label: res.country, data: emissionValues };
    }
  );

  return dataArray;
};

// Updates data to have the stack: total value, for stacked bar charts
export function updateTableDataWithStack(data: any[]) {
  return data.map((entry: any) => ({
    ...entry,
    stack: "total",
  }));
}

// Returns calculated values to be displayed in the CompareTable
export const determineTableDataStatistics = (
  emissionsDataResponses: any,
  range: number[]
) => {
  const totalAggregatedEmissions = aggregateMultipleCountryEmissions(
    emissionsDataResponses,
    range
  );
  return emissionsDataResponses.map((res: EmissionsDataResponseAndCountry) => {
    const percentChange = determinePercentChangeOfEmissions(res.data[1], range);
    const totalEmissions = determineTotalEmissions(res.data[1], range);
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
};

// Returns the sum of all emissions data for a list of country emissions data
export const aggregateMultipleCountryEmissions = (
  emissionsDataResponses: EmissionsDataResponseAndCountry[],
  range: number[]
) =>
  emissionsDataResponses.reduce(
    (sum, res) => sum + (determineTotalEmissions(res.data[1], range) as number),
    0
  );

// Returns a country' emissions data from a list
export const findDataByCountry = (
  emissionsDataResponses: EmissionsDataResponseAndCountry[],
  country: string
) => {
  return emissionsDataResponses?.find(
    (res) => res.country === ABBRV_TO_COUNTRY[country]
  );
};

// Calculates the Average Emissions values for an array of country emissions data
export const calculateAverageEmissions = (
  data: EmissionsDataResponseAndCountry[]
): {
  averages: (number | null)[];
  allYears: string[];
} => {
  // Gets all available years across all countries
  const allYearsSet = new Set<string>();
  data.forEach((countryData) => {
    const years = getYearsFromData(countryData.data[1]);
    if (years) {
      years.forEach((year) => allYearsSet.add(year));
    }
  });

  // Ensures years are in asc order
  const allYears = Array.from(allYearsSet).sort();

  // Calculate averages for each year
  const averages = allYears.map((year) => {
    const yearlyValues: number[] = [];

    // Collect values for the current year across all countries
    data.forEach((countryData) => {
      const yearData = countryData.data[1].find(
        (entry) => entry.date === year && entry.value !== null
      );
      if (yearData && yearData.value !== null) {
        yearlyValues.push(yearData.value);
      }
    });

    // Calculate the average or return null if no valid values
    if (yearlyValues.length === 0) {
      return null;
    }
    const total = yearlyValues.reduce((sum, val) => sum + val, 0);
    return total / yearlyValues.length;
  });

  return { averages, allYears };
};
