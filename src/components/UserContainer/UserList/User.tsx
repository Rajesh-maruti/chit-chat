import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import MessageStatus, { MessageStatusTypes } from "../../shared/MessageStatus";
import UserAvatar from "../../shared/Avatar/userAvatar";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { updateActiveUser } from "../../../store/reducerSlices/activeUserSlice";
import { RootState } from "../../../store";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useMessageStatus from "../../../functions/firebase/useMessageStatus";
import { UserDataType } from ".";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import useSound from "use-sound";
import incomingSound from "../../../sound/incomingMessage.mp3";
import UpdateUser from "./UpdateUser";

const User = (props: { user: UserDataType }) => {
  const dispatch = useDispatch();
  const isPreviousObjectLoaded = useRef(false);

  const handleActiveUser = async (user: UserDataType) => {
    dispatch(updateActiveUser(user));
    isPreviousObjectLoaded.current = false;
  };
  const [play] = useSound(incomingSound);
  const activeUser = useSelector((state: RootState) => state.activeUser.value);
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

  const lastMessage = useMemo(
    () => messageOverview[uid]?.lastMessage,
    [messageOverview, uid]
  );

  useEffect(() => {
    if (
      isPreviousObjectLoaded.current &&
      lastMessage?.sentBy !== loggedInUser?.phoneNumber
    ) {
      play();
    }
    if (lastMessage?.id) {
      isPreviousObjectLoaded.current = true;
    }
  }, [lastMessage, loggedInUser?.phoneNumber, play]);

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
              {messageOverview[uid]?.time}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="small"
              color="gray"
            >
              {messageOverview[uid]?.lastMessagedBy ===
                loggedInUser?.phoneNumber && (
                <MessageStatus status={getMessageStatus()} />
              )}
              {messageOverview[uid]?.lastMessagedBy !==
                loggedInUser?.phoneNumber &&
                messageOverview[uid]?.delivered - messageOverview[uid]?.read >
                  0 &&
                activeUser?.phoneNumber !== props.user.phoneNumber && (
                  <Badge
                    badgeContent={
                      messageOverview[uid]?.delivered -
                      messageOverview[uid]?.read
                    }
                    color="secondary"
                  >
                    <MailIcon color="action" />
                  </Badge>
                )}
              <UpdateUser user={props.user} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};

export default User;
