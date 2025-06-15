import {
  get,
  getDatabase,
  limitToLast,
  onChildAdded,
  onChildChanged,
  query,
  ref,
  set,
} from "firebase/database";
import { useCallback, useEffect, useRef } from "react";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageOverviewType,
  updateMessageStatus,
} from "../../store/reducerSlices/messageStatusSlice";
import { ChatType } from "../../components/MessageContainer/MessageContent";

const useMessageStatus = () => {
  const phone = useSelector(
    (state: RootState) => state.account.value?.phoneNumber
  );
  const activeUserPhoneNumber = useSelector(
    (state: RootState) => state.activeUser.value?.phoneNumber
  );
  const messageOverView = useSelector(
    (state: RootState) => state.messageStatus.value
  );
  const lastMessageData = useRef<{ [key: string]: MessageOverviewType }>({});

  useEffect(() => {
    lastMessageData.current = messageOverView;
  }, [messageOverView]);

  const dispatch = useDispatch();

  const getMessageStatus = useCallback(
    async (phoneNumber: string) => {
      const db = getDatabase();
      const combinedUid = [phone, phoneNumber].sort().join("");
      const statusRef = ref(db, `chats-message-status-${combinedUid}`);
      const data = await get(statusRef);
      return data.val();
    },
    [phone]
  );

  const onUpdateStatus = useCallback(
    async function (phoneNumber: string) {
      const db = getDatabase();
      const combinedUid = [phone, phoneNumber].sort().join("");
      const statusRef = ref(db, `chats-message-status-${combinedUid}`);
      onChildChanged(statusRef, () => {
        getMessageStatus(phoneNumber).then((status: MessageOverviewType) => {
          dispatch(updateMessageStatus(status));
        });
      });
    },
    [dispatch, getMessageStatus, phone]
  );

  const updateStatusOnNewMessage = useCallback(
    async function (phoneNumber: string) {
      const db = getDatabase();
      const combinedUid = [phone, phoneNumber].sort().join("");
      const statusRef = query(ref(db, `chats/${combinedUid}`), limitToLast(1));
      onChildAdded(statusRef, (data) => {
        const db = getDatabase();
        if (data.val().sentBy === phone) return;

        const previousData = lastMessageData.current[combinedUid];
        const postListRef = ref(db, `chats-message-status-${combinedUid}`);
        const isActiveChat = activeUserPhoneNumber === phoneNumber;
        const messageOverView: ChatType = data.val();
        const status = {
          delivered: messageOverView.id,
          read: isActiveChat ? messageOverView.id : previousData?.read || 0,
          lastMessagedBy: phoneNumber,
          lastMessage: messageOverView,
          uid: combinedUid,
        };
        set(postListRef, status);
      });
    },
    [activeUserPhoneNumber, phone]
  );

  return { getMessageStatus, updateStatusOnNewMessage, onUpdateStatus };
};

export default useMessageStatus;
