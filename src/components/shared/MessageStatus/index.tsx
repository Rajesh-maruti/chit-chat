import Box from "@mui/material/Box";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

export type MessageStatusTypes = "delivered" | "sent" | "read";

const MessageStatus = ({
  status,
  iconSize,
}: {
  status: MessageStatusTypes;
  iconSize?: string;
}) => {
  const iconStyle: React.CSSProperties = { fontSize: iconSize };
  return (
    <Box>
      {status === "read" && <DoneAllIcon color="primary" style={iconStyle} />}
      {status === "delivered" && <DoneAllIcon style={iconStyle} />}
      {status === "sent" && <DoneIcon style={iconStyle} />}
    </Box>
  );
};

export default MessageStatus;
