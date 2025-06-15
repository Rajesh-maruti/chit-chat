import Box from "@mui/material/Box";
import ActiveUserHeader from "../ActiveUserHeader";
import { UserDataType } from "../UserContainer/UserList";
import MessageBlock from "./MessageContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { updatePreviousMessage } from "../../store/reducerSlices/chatSlice";
import useScrollIntoView, { ElementEnum } from "../../hooks/useScrollIntoView";
import { useCallback, useEffect, useRef, useState } from "react";
import UserInput from "./UserInput";
import useChat from "../../functions/firebase/useChat";
import { Unsubscribe } from "firebase/auth";

const MessageContainer = (props: { activeUser?: UserDataType | null }) => {
  const chats = useSelector((state: RootState) => state.chats.value);
  const [isLoadedPreviousMessage, setIsLoadedPreviousMessage] = useState(false);
  const { ref, scrollIntoView } = useScrollIntoView(ElementEnum.lastElement);
  const detachFunValue = useRef<Unsubscribe | null>(null);
  const activeUser = useSelector((state: RootState) => state.activeUser.value);
  const loggedInUser = useSelector((state: RootState) => state.account.value);

  const messageOverview = useSelector(
    (state: RootState) => state.messageStatus.value
  );

  const getLastReadId = useCallback(() => {
    const uid = [loggedInUser?.phoneNumber, activeUser?.phoneNumber]
      .sort()
      .join("");
    return messageOverview[uid]?.read;
  }, [activeUser?.phoneNumber, loggedInUser?.phoneNumber, messageOverview]);

  const getLastDeliveredId = useCallback(() => {
    const uid = [loggedInUser?.phoneNumber, activeUser?.phoneNumber]
      .sort()
      .join("");
    return messageOverview[uid]?.delivered;
  }, [activeUser?.phoneNumber, loggedInUser?.phoneNumber, messageOverview]);

  useEffect(() => {
    if (detachFunValue && isLoadedPreviousMessage) {
      detachFunValue.current?.();
      detachFunValue.current = null;
    }
  }, [activeUser?.phoneNumber, isLoadedPreviousMessage]);

  const { getChats, onNewMessage } = useChat();
  const dispatch = useDispatch();

  const getChatList = useCallback(async () => {
    const chats = await getChats(`${props.activeUser?.phoneNumber!}`);
    dispatch(updatePreviousMessage(chats.data));
    setIsLoadedPreviousMessage(true);
  }, [dispatch, getChats, props.activeUser?.phoneNumber]);

  const handleNewMessage = useCallback(async () => {
    const detachFun = await onNewMessage(`${activeUser?.phoneNumber!}`);
    detachFunValue.current = detachFun;
    setIsLoadedPreviousMessage(false);
  }, [activeUser?.phoneNumber, onNewMessage]);

  useEffect(() => {
    if (isLoadedPreviousMessage) handleNewMessage();
  }, [handleNewMessage, isLoadedPreviousMessage]);

  useEffect(() => {
    getChatList();
  }, [activeUser?.phoneNumber, getChatList]);

  useEffect(() => {
    if (chats.length > 0) {
      scrollIntoView();
    }
  }, [chats, scrollIntoView]);

  return (
    <Box>
      {props.activeUser && (
        <>
          <Box position="sticky" top={0} zIndex={1}>
            <ActiveUserHeader user={props.activeUser} />
          </Box>
          <Box
            px={6}
            py={2}
            sx={{ border: "2px solid #f5f5f5", borderRadius: "3px" }}
            ref={ref}
            overflow="auto"
            height="calc(100vh - 198px)"
          >
            {chats.map((message) => (
              <MessageBlock
                chat={message}
                lastReadId={getLastReadId()}
                lastDeliveredId={getLastDeliveredId()}
              />
            ))}
          </Box>
          <UserInput />
        </>
      )}
    </Box>
  );
};

export default MessageContainer;
