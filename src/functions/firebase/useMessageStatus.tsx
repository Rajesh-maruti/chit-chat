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
import { useCallback, useMemo, useRef } from "react";
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
      onChildChanged(statusRef, (data) => {
        getMessageStatus(phoneNumber).then(
          (previousData: MessageOverviewType) => {
            dispatch(updateMessageStatus(previousData));
          }
        );
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
        getMessageStatus(phoneNumber).then(
          (previousData: MessageOverviewType) => {
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
          }
        );
      });
    },
    [activeUserPhoneNumber, getMessageStatus, phone]
  );

  return { getMessageStatus, updateStatusOnNewMessage, onUpdateStatus };
};

export default useMessageStatus;
