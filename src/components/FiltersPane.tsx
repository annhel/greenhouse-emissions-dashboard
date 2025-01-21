import Typography from "@mui/material/Typography";
import { COUNTRIES_ABBREV } from "../utils/constants";
import MultiSelectChip from "./MultiSelectChip";
import Slider from "./Slider";

export default function FiltersPane() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <MultiSelectChip options={COUNTRIES_ABBREV} label="Select Countries" />
        <div>
          <Typography gutterBottom>Select a Date Range</Typography>
          <Slider />
        </div>
      </div>
    </>
  );
}
