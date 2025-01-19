import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  const handleClose = (option: string) => {
    setAnchorEl(null);
  };

  const handleSelection = (option: string) => {
    setOption(option);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
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
          <MenuItem onClick={() => handleSelection(option)}>{option}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}
