import Grid from "@mui/material/Grid";
import UserList from "../../components/UserContainer/UserList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import MessageContainer from "../../components/MessageContainer";
import { Box, Typography } from "@mui/material";
import UserContainer from "../../components/UserContainer";
import { useCallback, useEffect } from "react";
import { manageUser } from "../../functions/firebase/manageUser";
import useUpdateOnlineStatus from "../../hooks/useUpdateOnlineStatus";
import useMessageStatus from "../../functions/firebase/useMessageStatus";
import {
  MessageOverviewType,
  setAllMessageStatus,
} from "../../store/reducerSlices/messageStatusSlice";

const ChatPage = () => {
  const activeUser = useSelector((state: RootState) => state.activeUser);
  useUpdateOnlineStatus();
  const dispatch = useDispatch();
  const userList = useSelector((state: RootState) => state.userList.value);

  const { getMessageStatus } = useMessageStatus();

  const handleUpdateSttausForAllUsers = useCallback(async () => {
    const messageStatus: { [key: string]: MessageOverviewType } = {};
    const data = (
      await Promise.all(
        userList.map((each) => getMessageStatus(each.phoneNumber))
      )
    ).filter((each) => each);
    console.log(data,'messageStatus data')
    data.forEach((each) => {
      messageStatus[each.uid] = each;
    });
    console.log(messageStatus,'messageStatus')
    dispatch(setAllMessageStatus(messageStatus));
  }, [dispatch, getMessageStatus, userList]);

  useEffect(() => {
    handleUpdateSttausForAllUsers();
  }, [dispatch, getMessageStatus, handleUpdateSttausForAllUsers, userList]);

  return (
    <Box maxHeight="100vh" overflow="hidden">
      <Grid container>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            borderRight="1px solidrgba(240, 240, 240, 0.79)"
            height="100vh"
            sx={{ backgroundColor: "#f0f0f0" }}
          >
            <UserContainer />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {activeUser.value ? (
            <MessageContainer activeUser={activeUser.value} />
          ) : (
            <Box height="100vh">
              <Box
                p={0}
                height="50px"
                width="100%"
                sx={{ backgroundColor: "#e7e7e7" }}
              ></Box>
              <Box
                height="calc(100vh - 50px)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography>Select User to continue on chat.</Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatPage;
