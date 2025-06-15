import Box from "@mui/material/Box";
import Menu, { MenuItemType } from "../../Menu";
import { UserDataType } from ".";
import ReNameOrAddUserToChat from "../UserListActions/ReNameOrAddUserToChat";
import { useState } from "react";

const UpdateUser = (props: { user: UserDataType }) => {
  const [open, setOpen] = useState(false);
  const menuItems: Array<MenuItemType> = [
    {
      title:
        props.user.phoneNumber === props.user.name
          ? "Save the number"
          : "Rename",
      onSelect: () => {
        setOpen(true);
      },
    },
  ];
  return (
    <Box>
      <Menu showMoreIcon menuItems={menuItems} />
      <ReNameOrAddUserToChat
        open={open}
        phoneNumber={props.user.phoneNumber}
        onClose={() => setOpen(false)}
        renameUser
        user={props.user}
      />
    </Box>
  );
};

export default UpdateUser;
