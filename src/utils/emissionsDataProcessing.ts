import { EmissionsData } from "../types/EmissionsData";

// Returns the sum of emissions for a given dataset
export const determineTotalEmissions = (
  emissionsData: EmissionsData[]
): number => {
  return Math.round(
    emissionsData
      .filter((dataEntry: EmissionsData) => dataEntry.value !== null)
      .reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.value as number);
      }, 0)
  );
};

// Returns the % change of emissions from the latest and first year od recorded emissions
export const determinePercentChangeOfEmissions = (
  emissionsData: EmissionsData[]
): number | null => {
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

  return Math.round(result * 10) / 10;
};

// Returns the year with the highest recorded emissions
export const findHighestYearOfEmissions = (
  emissionsData: EmissionsData[]
): EmissionsData | null => {
  if (emissionsData.length === 0) {
    console.warn("No emissions data provided.");
    return null;
  }

  return emissionsData.reduce((highestYear, currentYear) => {
    if (currentYear.value === null) return highestYear;

    return highestYear &&
      highestYear.value !== null &&
      highestYear.value > currentYear.value
      ? highestYear
      : currentYear;
  }, null as EmissionsData | null);
};
