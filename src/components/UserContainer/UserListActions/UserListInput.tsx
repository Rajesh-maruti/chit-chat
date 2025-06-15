import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";
import useDeboubnce from "../../../hooks/useDebounce";
import Input from "../../shared/Input";
import { manageUser } from "../../../functions/firebase/manageUser";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { CircularProgress } from "@mui/material";
import toast from "../../../functions/toast";
import AddUserToChat from "./ReNameOrAddUserToChat";

const UserListInput = (props: { onValueChange?: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState("");
  const value = useDeboubnce(inputValue, 200);
  const userData = useSelector((state: RootState) => state.account.value);
  const userList = useSelector((state: RootState) => state.userList.value);
  const [openPopUp, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.onValueChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const searchedPhoneNumber = useMemo(() => {
    return `+91${inputValue}`;
  }, [inputValue]);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Input
        placeholder="Search/Add User!!"
        value={inputValue}
        onValueChange={async (e) => {
          setInputValue(e);
        }}
      />
      <Box
        sx={
          userData?.phoneNumber === `${searchedPhoneNumber}` ||
          !searchedPhoneNumber
            ? { cursor: "not-allowed", opacity: 0.5 }
            : { cursor: "pointer" }
        }
        onClick={async () => {
          if (userData?.phoneNumber === `${searchedPhoneNumber}`) return;
          if (inputValue.length !== 10) {
            return toast.error("Mobile number is not valid.");
          }
          setLoading(true);
          const isUserRegistered = await manageUser.phoneNumberExist(
            `91${inputValue}`
          );
          const isPhoneNumberAlreadyLinked = userList?.find((each) =>
            each.phoneNumber.includes(inputValue)
          );
          if (isPhoneNumberAlreadyLinked) {
            toast.error("Mobile number linked already.");
          } else if (isUserRegistered) {
            setOpenPopup(true);
          } else {
            toast.error("Mobile number is not found.");
          }
          setLoading(false);
        }}
      >
        {loading ? <CircularProgress size="23px" /> : <AddIcon />}
      </Box>
      <AddUserToChat
        open={openPopUp}
        onClose={() => setOpenPopup(false)}
        phoneNumber={`+91${inputValue}`}
      />
    </Box>
  );
};

export default UserListInput;
