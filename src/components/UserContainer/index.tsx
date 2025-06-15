import Box from "@mui/material/Box";
import UserList, { UserDataType } from "./UserList";
import UserListInput from "./UserListActions/UserListInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { manageUser } from "../../functions/firebase/manageUser";
import { updateUsers } from "../../store/reducerSlices/userSlice";

const UserContainer = () => {
  const userList = useSelector((state: RootState) => state.userList.value);
  const [data, setData] = useState(userList);
  const currentUser = useSelector((state: RootState) => state.account?.value);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const updateChatUsers = useCallback(
    async (phoneNumber: string) => {
      setLoading(true);
      const users: UserDataType[] = await manageUser.getChatUsers(phoneNumber);
      dispatch(updateUsers(users));
      setData(users);
      setLoading(false);
    },
    [dispatch]
  );

  useEffect(() => {
    if (currentUser?.phoneNumber)
      manageUser.onNewReload(currentUser?.phoneNumber, () => {
        updateChatUsers(currentUser?.phoneNumber!);
      });
  }, [currentUser?.phoneNumber, updateChatUsers]);

  useEffect(() => {
    if (currentUser?.phoneNumber) {
      updateChatUsers(currentUser.phoneNumber);
    }
  }, [currentUser?.phoneNumber, dispatch, updateChatUsers]);

  const handleSearchUser = (search: string) => {
    setData(
      userList.filter((each) => {
        return each.name.includes(search) || each.phoneNumber.includes(search);
      })
    );
  };

  const hasData = data?.length > 0;

  return (
    <Box position="relative" height="100vh" overflow="auto">
      <Box p={2}>
        <Box
          position="sticky"
          top={0}
          zIndex={1}
          sx={{ backgroundColor: "#f0f0f0" }}
        >
          <UserListInput onValueChange={handleSearchUser} />
        </Box>
        {loading && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {hasData && !loading && <UserList data={data} />}
        {!hasData && !loading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="90vh"
          >
            <Typography color="#5a5858">
              Please clear filter or try to add user to your chat list.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserContainer;
