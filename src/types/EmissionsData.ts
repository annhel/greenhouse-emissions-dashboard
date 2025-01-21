export type EmissionsDataResponseAndCountry = {
    country: string
    data: EmissionsDataResponse
}

export type EmissionsDataResponse = [MetaData, EmissionsData[]];

export type EmissionsData = {
  indicator: Indicator;
  country: Country;
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
};

type Indicator = {
  id: string;
  value: string;
};

type Country = {
  id: string;
  value: string;
};

type MetaData = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
};
