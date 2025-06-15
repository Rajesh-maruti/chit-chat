import { Box, Button, Dialog, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useState } from "react";
import Input from "../../shared/Input";
import { manageUser } from "../../../functions/firebase/manageUser";
import { toast } from "react-toastify";
import { UserDataType } from "../UserList";

const ReNameOrAddUserToChat = (props: {
  open: boolean;
  phoneNumber: string;
  onClose: () => void;
  renameUser?: boolean;
  user?: UserDataType;
}) => {
  const loggedInUser = useSelector((state: RootState) => state.account.value);
  const [name, setName] = useState("");

  const handleRenameUser = async () => {
    if (!props.user) return;
    await manageUser.updateUserName(loggedInUser?.phoneNumber!, props.user.id, {
      ...props.user,
      name,
      image: props.user?.image ?? "",
    });
    manageUser.reloadUserList(loggedInUser?.phoneNumber!);
    toast.success("User Renamed!");
    props.onClose?.();
  };

  const AddNewUser = () => {
    const isUserAddedToChat = manageUser.addNewUserToChat(
      loggedInUser?.phoneNumber!,
      props.phoneNumber,
      name
    );
    if (!!isUserAddedToChat) {
      manageUser.reloadUserList(loggedInUser?.phoneNumber!);
      toast.success("User added to chat");
      props.onClose?.();
    }
  };

  return (
    <Dialog open={props.open}>
      <Box py={2} px={3}>
        <Box>
          <Typography variant="body1" pb={1}>
            How do you want to save it?
          </Typography>
          <Input value={name} onValueChange={setName} />
        </Box>
        <Box ml="auto" width="fit-content" pt={1}>
          <Button
            onClick={() => {
              if (props.renameUser) {
                handleRenameUser();
              } else {
                AddNewUser();
              }
            }}
          >
            {props.renameUser ? "Rename" : "Add"}
          </Button>
          <Button onClick={props.onClose}>Cancle</Button>
        </Box>
      </Box>
    </Dialog>
  );
};
export default ReNameOrAddUserToChat;
