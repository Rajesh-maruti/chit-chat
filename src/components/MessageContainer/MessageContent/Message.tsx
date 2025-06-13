import Box from "@mui/material/Box";
import ImageBlock from "../../shared/Image/Image";
import VideoBlock from "../../shared/Video/Video";

const Message = (props: {
  message:
    | { type: "video" | "image"; value: File | string }
    | { type: "text"; value: string };
}) => {
  return (
    <Box>
      {props.message.type === "image" && (
        <ImageBlock image={props.message.value} />
      )}
      {props.message.type === "video" && (
        <VideoBlock src={props.message.value} />
      )}
      {props.message.type === "text" && (
        <Box sx={{ wordBreak: "break-all" }}>{props.message.value}</Box>
      )}
    </Box>
  );
};

export default Message;
