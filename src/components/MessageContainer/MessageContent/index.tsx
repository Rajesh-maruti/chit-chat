import Box from "@mui/material/Box";
import MessageLayout from "../../shared/MessageLayout";
import MessageStatus, { MessageStatusTypes } from "../../shared/MessageStatus";
import Message from "./Message";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useCallback } from "react";

export type ChatType = {
  id: number;
  time: string;
  message:
    | { type: "image" | "video"; value: File | string }
    | {
        type: "text";
        value: string;
      };
  sentBy: string;
  messageStatus: "delivered" | "sent" | "read";
};

const MessageBlock = (props: {
  chat: ChatType;
  lastReadId: number;
  lastDeliveredId: number;
}) => {
  const user = useSelector((state: RootState) => state.account.value);
  const isSentMessage = props.chat?.sentBy === user?.phoneNumber;

  const getMessageStatus: (messageId: number) => MessageStatusTypes =
    useCallback(
      (messageId: number) => {
        if (messageId <= props.lastReadId) return "read";
        if (messageId <= props.lastDeliveredId) return "delivered";
        return "sent";
      },
      [props.lastDeliveredId, props.lastReadId]
    );
  return (
    <Box py={2}>
      <MessageLayout rightAlign={isSentMessage}>
        <Box alignItems="center" py={1} gap={1} sx={{ fontSize: "12px" }}>
          <Message message={props.chat.message} />
          <Box display="flex" alignItems="center" gap={1} marginLeft={1}>
            <Box ml="auto">{props.chat.time}</Box>
            {isSentMessage && (
              <MessageStatus
                status={getMessageStatus(props.chat.id)}
                iconSize="15px"
              />
            )}
          </Box>
        </Box>
      </MessageLayout>
    </Box>
  );
};

export default MessageBlock;
