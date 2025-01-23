import Button from "@mui/material/Button";
import { useState } from "react";
import { COUNTRIES_ABBREV } from "../utils/constants";
import MinimumDistanceSlider from "./MinimumDistanceSlider";
import MultiSelectChip from "./MultiSelectChip";
import { Typography } from "@mui/material";

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
  const handleFilterReset = () => {
    setCountries([]);
    setYears([1974, 2023]);
  };
  return (
    <>
      <div
        data-testid="filters-pane"
        className="mt-3rem"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          borderBottom: "2px solid rgba(114, 114, 114, 0.33)",
          paddingBottom: "2rem",
        }}
      >
        <MultiSelectChip
          options={COUNTRIES_ABBREV}
          label="Select Countries"
          selectedOptions={countries}
          setSelectedOptions={setCountries}
        />

        <div className=" display-flex flex-dir-col align-center">
          <Typography>Set Date Range</Typography>
          <div className="display-flex align-center">
            <Typography style={{ paddingRight: "20px" }}>{years[0]}</Typography>

            <MinimumDistanceSlider range={years} setRange={setYears} />

            <Typography style={{ paddingLeft: "20px" }}>{years[1]}</Typography>
          </div>
        </div>
        <div>
          <Button variant="outlined" onClick={() => handleFilterReset()}>
            Clear Filters
          </Button>
        </div>
      </div>
    </>
  );
}
