import {
  getDatabase,
  limitToLast,
  onChildAdded,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import firebase from ".";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ChatType } from "../../components/MessageContainer/MessageContent";
import { useCallback, useEffect, useRef } from "react";
import { addMessage } from "../../store/reducerSlices/chatSlice";
import { MessageOverviewType } from "../../store/reducerSlices/messageStatusSlice";
import usePagination from "../../hooks/usePagination";

const useChat = () => {
  const phone = useSelector(
    (state: RootState) => state.account.value?.phoneNumber
  );
  const lastMessageData = useRef<{ [key: string]: MessageOverviewType }>({});
  const messageOverView = useSelector(
    (state: RootState) => state.messageStatus.value
  );
  const { getPreviousData } = usePagination();

  useEffect(() => {
    lastMessageData.current = messageOverView;
  }, [messageOverView]);

  const dispatch = useDispatch();

  const updateChat = function (message: ChatType, senderPhone: string) {
    const combinedUid = [phone, senderPhone].sort().join("");
    const db = getDatabase(firebase);
    const postListRef = ref(db, `chats/${combinedUid}`);
    const newPostRef = push(postListRef);
    set(newPostRef, message);
    const chatStatusRef = ref(db, `chats-message-status-${combinedUid}`);
    const previousData = lastMessageData.current[combinedUid];
    const status = {
      delivered: previousData.delivered,
      read: previousData.read,
      lastMessagedBy: phone,
      lastMessage: message,
      uid: combinedUid,
    };
    set(chatStatusRef, status);
  };

  const getChats = useCallback(
    async function (phoneNumber: string) {
      const db = getDatabase();
      const combinedUid = [phone, phoneNumber].sort().join("");
      const chatsRef = ref(db, `chats/${combinedUid}`);
      const data = await getPreviousData(chatsRef);
      return { data, getPreviousData };
    },
    [getPreviousData, phone]
  );

  const onNewMessage = useCallback(
    async function (phoneNumber: string) {
      const db = getDatabase();
      const combinedUid = [phone, phoneNumber].sort().join("");
      const commentsRef = query(
        ref(db, `chats/${combinedUid}`),
        limitToLast(1)
      );
      let loaded = false;
      const eventListener = onChildAdded(commentsRef, (data) => {
        const chat: ChatType = data.val();
        if (loaded) {
          dispatch(addMessage(chat));
        }
        loaded = true;
      });
      return eventListener;
    },
    [dispatch, phone]
  );

  return { updateChat, getChats, onNewMessage };
};

export default useChat;
