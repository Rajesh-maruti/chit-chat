import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import MessageStatus, { MessageStatusTypes } from "../../shared/MessageStatus";
import UserAvatar from "../../shared/Avatar/userAvatar";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { updateActiveUser } from "../../../store/reducerSlices/activeUserSlice";
import { RootState } from "../../../store";
import { useCallback, useEffect, useState } from "react";
import { manageUser } from "../../../functions/firebase/manageUser";
import { updateUsers } from "../../../store/reducerSlices/userSlice";
import useMessageStatus from "../../../functions/firebase/useMessageStatus";
import { UserDataType } from ".";

const User = (props: { user: UserDataType }) => {
  const dispatch = useDispatch();
  const handleActiveUser = async (user: UserDataType) => {
    dispatch(updateActiveUser(user));
  };
  const loggedInUser = useSelector((state: RootState) => state.account.value);
  const messageOverview = useSelector(
    (state: RootState) => state.messageStatus.value
  );
  const uid = [loggedInUser?.phoneNumber, props.user.phoneNumber]
    .sort()
    .join("");

  const { updateStatusOnNewMessage, onUpdateStatus } = useMessageStatus();

  const handleNewMessage = useCallback(() => {
    updateStatusOnNewMessage(props.user.phoneNumber);
    onUpdateStatus(props.user.phoneNumber);
  }, [onUpdateStatus, props.user.phoneNumber, updateStatusOnNewMessage]);

  useEffect(() => {
    handleNewMessage();
  }, [handleNewMessage]);

  const getMessage: () => string = useCallback(() => {
    if (messageOverview[uid]?.lastMessage?.message.type === "text") {
      return messageOverview[uid]?.lastMessage?.message.value?.toString();
    } else if (messageOverview[uid]?.lastMessage?.message.type === "image") {
      return "Image";
    } else if (messageOverview[uid]?.lastMessage?.message.type === "video") {
      return "video";
    }
    return "";
  }, [messageOverview, uid]);

  const getMessageStatus: () => MessageStatusTypes = useCallback(() => {
    if (messageOverview[uid]?.lastMessage.id <= messageOverview[uid]?.read) {
      return "read";
    }
    if (
      messageOverview[uid]?.lastMessage.id <= messageOverview[uid]?.delivered
    ) {
      return "delivered";
    }
    return "sent";
  }, [messageOverview, uid]);

  return (
    <Box
      key={props.user.name}
      sx={{ cursor: "pointer" }}
      onClick={() => handleActiveUser(props.user)}
    >
      <Grid container spacing={2} py={2}>
        <Grid size={2}>
          <UserAvatar
            image={props.user.image}
            name={props.user.name}
            randomBg
          />
        </Grid>
        <Grid size={7}>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Box fontWeight="bold">{props.user.name}</Box>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getMessage()}
            </Box>
          </Box>
        </Grid>
        <Grid size={3}>
          <Box sx={{ textAlign: "right" }}>
            <Box fontSize="small" color="gray">
              {props.user.time}
            </Box>
            <Box fontSize="small" color="gray">
              {messageOverview[uid]?.lastMessagedBy ===
                loggedInUser?.phoneNumber && (
                <MessageStatus status={getMessageStatus()} />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};

export default User;
