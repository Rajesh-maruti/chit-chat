import * as React from "react";
import Button from "@mui/material/Button";
import MiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export type MenuItemType = { title: string; onSelect: () => void };

export default function Menu(props: {
  showMoreIcon?: boolean;
  menuTitle?: string;
  menuItems: Array<MenuItemType>;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (data: MenuItemType) => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {props.showMoreIcon ? <MoreVertIcon /> : props.menuTitle}
      </Button>
      <MiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "menu-item",
          },
        }}
      >
        {props.menuItems.map((each) => (
          <MenuItem
            onClick={() => {
              each.onSelect();
              handleClose(each);
            }}
          >
            {each.title}
          </MenuItem>
        ))}
      </MiMenu>
    </div>
  );
}
