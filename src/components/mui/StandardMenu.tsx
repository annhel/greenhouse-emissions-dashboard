import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ABBRV_TO_COUNTRY } from "../../utils/constants";

export type StandardMenuProps = {
  label: any;
  options: string[];
  setOption: React.Dispatch<React.SetStateAction<string>>;
};

export default function StandardMenu({
  label,
  options,
  setOption,
}: StandardMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (option: string) => {
    setOption(option);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        style={{ color: "#94B4CC" }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {label}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleSelection(option)}>
            {ABBRV_TO_COUNTRY[option]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
