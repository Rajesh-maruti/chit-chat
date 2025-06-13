import {
  child,
  get,
  getDatabase,
  limitToLast,
  off,
  onChildAdded,
  onValue,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import firebase from ".";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ChatType } from "../../components/MessageContainer/MessageContent";
import { useCallback } from "react";
import { addMessage } from "../../store/reducerSlices/chatSlice";

const useChat = () => {
  const phone = useSelector(
    (state: RootState) => state.account.value?.phoneNumber
  );
  const dispatch = useDispatch();
  const updateChat = function (message: {}, senderPhone: string) {
    const combinedUid = [phone, senderPhone].sort().join("");
    const db = getDatabase(firebase);
    const postListRef = ref(db, `chats/${combinedUid}`);
    const newPostRef = push(postListRef);
    set(newPostRef, message);
  };

  const getChats = useCallback(
    async function (phoneNumber: string) {
      const dbRef = ref(getDatabase());
      const combinedUid = [phone, phoneNumber].sort().join("");
      const chats = await get(child(dbRef, `chats/${combinedUid}`));
      if (chats.exists()) {
        const data: Array<ChatType> = [];
        chats.forEach((each) => {
          data.push(each.val());
        });
        return data;
      }
      return [];
    },
    [phone]
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
        if (loaded) {
          dispatch(addMessage(data.val()));
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
