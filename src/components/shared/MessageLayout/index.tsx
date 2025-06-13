import Box from "@mui/material/Box";
import { ReactNode } from "react";

const MessageLayout = (props: {
  rightAlign?: boolean;
  children: ReactNode;
}) => {
  return (
    <Box
      maxWidth="70%"
      ml={props.rightAlign ? "auto" : "0px"}
      alignItems="center"
      padding={2}
      width="fit-content"
      minHeight="30px"
      borderRadius="10px"
      position="relative"
      sx={{
        backgroundColor: props.rightAlign ? "#c2f0c2" : "#f5f5f5",
        "&::before": {
          content: '""',
          width: "13px",
          height: "15px",
          position: "absolute",
          backgroundColor: props.rightAlign ? "#c2f0c2" : "#f5f5f5",
          bottom: "-8px",
          ...(props.rightAlign
            ? {
                left: "0px",
                borderRadius: "0px 0px 58px 0px",
              }
            : {
                right: "0px",
                borderRadius: "0px 0px 0px 58px",
              }),
        },
        "&::after": {
          content: '""',
          width: "6px",
          height: "9px",
          position: "absolute",
          bottom: "-8px",
          backgroundColor: props.rightAlign ? "#c2f0c2" : "#f5f5f5",
          ...(props.rightAlign
            ? { left: "-1px", borderTopLeftRadius: "83px" }
            : {
                right: "-1px",
                borderTopRightRadius: "83px",
              }),
        },
      }}
    >
      {props.children}
    </Box>
  );
};

export default MessageLayout;
