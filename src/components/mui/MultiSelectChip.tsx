import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { ABBRV_TO_COUNTRY } from "../../utils/constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, selectedOptions: readonly string[], theme: Theme) {
  return {
    fontWeight: selectedOptions.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export type MultiSelectChip = {
  selectedOptions: string[]
  options: string[];
  label: string;
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function MultiSelectChip({ options, label, setSelectedOptions, selectedOptions }: MultiSelectChip) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="country-multi-select-label">{label}</InputLabel>
        <Select
          labelId="country-multi-select-label"
          id="country-multi-select"
          multiple
          value={selectedOptions}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((o) => (
            <MenuItem
              key={o}
              value={o}
              style={getStyles(o, selectedOptions, theme)}
            >
              {ABBRV_TO_COUNTRY[o]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
