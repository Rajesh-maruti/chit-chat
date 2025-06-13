import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import MessageStatus, { MessageStatusTypes } from "../../shared/MessageStatus";
import UserAvatar from "../../shared/Avatar/userAvatar";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { updateActiveUser } from "../../../store/reducerSlices/activeUserSlice";
import { RootState } from "../../../store";
import { useCallback, useEffect, useState } from "react";
import { manageUser } from "../../../functions/firebase/manageUser";
import { updateUsers } from "../../../store/reducerSlices/userSlice";
import useMessageStatus from "../../../functions/firebase/useMessageStatus";
import User from "./User";

export type UserDataType = {
  name: string;
  image: string;
  lastMessage: string;
  time: string;
  messageStatus: MessageStatusTypes;
  phoneNumber: string;
};

const UserList = (props: { data: UserDataType[] }) => {
  return (
    <Box>
      {props.data?.map((user) => (
        <User user={user} />
      ))}
    </Box>
  );
};

export default UserList;
