import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 0;

export type MinimumDistanceSliderProps = {
  range: number[];
  setRange: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function MinimumDistanceSlider({
  range,
  setRange,
}: MinimumDistanceSliderProps) {
  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - minDistance), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + minDistance)]);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={range}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        min={1974}
        max={2023}
      />
    </Box>
  );
}
