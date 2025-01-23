import {
  EmissionsData,
  EmissionsDataResponseAndCountry,
} from "../types/EmissionsData";

// Returns the sum of emissions for a given dataset
export const determineTotalEmissions = (
  emissionsData: EmissionsData[]
): number | null => {
  if (!emissionsData) {
    console.warn("No emissions data provided.");
    return null;
  }

  return Math.round(
    emissionsData
      .filter((dataEntry: EmissionsData) => dataEntry.value !== null)
      .reduce((sum, currentValue) => {
        return sum + (currentValue.value as number);
      }, 0)
  );
};

// Returns the % change of emissions from the latest and first year od recorded emissions
export const determinePercentChangeOfEmissions = (
  emissionsData: EmissionsData[]
) => {
  const validData = emissionsData.filter(
    (dataEntry) => dataEntry.value !== null
  );

  if (validData.length < 2) {
    console.warn("Not enough data to calculate percent change.");
    return null;
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
    value: highestEntry.value,
  };
};

// Maps over emissions data and returns an array of all the years in the data
export const getYearsFromData = (
  emissionsData: EmissionsData[]
): string[] | null => {
  if (!emissionsData || emissionsData.length === 0) {
    return null;
  }

  // Array is reversed to return the years in ascending order
  return emissionsData
    .slice()
    .reverse()
    .map((dataEntry) => dataEntry.date);
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
        return { data: [] };
      }

      let emissionValues: number[];
      if (range) {
        emissionValues = res.data[1]
          .slice()
          .reverse()
          .filter(
            (dataEntry: any) =>
              range[0] <= dataEntry.date && range[1] >= dataEntry.date
          )
          .map((dataEntry: any) => dataEntry.value);
      } else {
        emissionValues = emissionValues = res.data[1]
          .slice()
          .reverse()
          .map((dataEntry: any) => dataEntry.value);
      }

      return { label: res.country, data: emissionValues };
    }
  );

  return dataArray;
};

export function updateTableDataWithStack(data: any[]) {
  return data.map((entry: any) => ({
    ...entry,
    stack: "total",
  }));
}
