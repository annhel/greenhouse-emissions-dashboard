import Typography from "@mui/material/Typography";
import { COUNTRIES_ABBREV } from "../utils/constants";
import MultiSelectChip from "./MultiSelectChip";
import MinimumDistanceSlider from "./MinimumDistanceSlider";

export type FiltersPaneProps = {
  countries: string[];
  setCountries: React.Dispatch<React.SetStateAction<string[]>>;
  years: number[];
  setYears: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function FiltersPane({
  countries,
  setCountries,
  years,
  setYears,
}: FiltersPaneProps) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <MultiSelectChip
          options={COUNTRIES_ABBREV}
          label="Select Countries"
          selectedOptions={countries}
          setSelectedOptions={setCountries}
        />
        <div>
          <Typography gutterBottom>Select a Date Range</Typography>
          <MinimumDistanceSlider range={years} setRange={setYears} />
        </div>
      </div>
    </>
  );
}
