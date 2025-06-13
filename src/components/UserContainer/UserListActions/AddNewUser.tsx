import { Box, Button, Dialog, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useState } from "react";
import Input from "../../shared/Input";
import { manageUser } from "../../../functions/firebase/manageUser";
import { toast } from "react-toastify";

const AddUserToChat = (props: {
  open: boolean;
  phoneNumber: string;
  onClose: () => void;
}) => {
  const loggedInUser = useSelector((state: RootState) => state.account.value);
  const [name, setName] = useState("");

  return (
    <Dialog open={props.open}>
      <Box px={3} py={2}>
        <Stack>
          How do you want to save the name?
          <Input value={name} onValueChange={setName} />
        </Stack>
      </Box>
      <Box ml="auto">
        <Button
          onClick={() => {
            const isUserAddedToChat = manageUser.addNewUserToChat(
              loggedInUser?.phoneNumber!,
              props.phoneNumber,
              name
            );
            if (!!isUserAddedToChat) {
              manageUser.reloadUserList(loggedInUser?.phoneNumber!);
              toast.success("Uer added to chat");
            }
          }}
        >
          Add
        </Button>
        <Button onClick={props.onClose}>Cancle</Button>
      </Box>
    </Dialog>
  );
};
export default AddUserToChat;
