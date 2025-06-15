import Box from "@mui/material/Box";
import { UserDataType } from "../UserContainer/UserList";
import UserAvatar from "../shared/Avatar/userAvatar";
import useGetOnlineStatus from "../../hooks/useGetOnlineStatus";
import { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { updateActiveUser } from "../../store/reducerSlices/activeUserSlice";

const ActiveUserHeader = (props: { user: UserDataType }) => {
  const { getUserStatus, OnStatusChange } = useGetOnlineStatus();
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(false);

  const getOnlineStatus = useCallback(async () => {
    const data = await getUserStatus(`${props.user.phoneNumber}`);
    setIsOnline(data?.online);
  }, [getUserStatus, props.user.phoneNumber]);

  useEffect(() => {
    getOnlineStatus();
    OnStatusChange(`${props.user.phoneNumber}`, (data) => {
      setIsOnline(data);
    });
  }, [OnStatusChange, getOnlineStatus, props.user.phoneNumber]);
  return (
    <Box>
      <Box
        gap={2}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          minHeight: "30px",
        }}
      >
        <Box
          sx={{ display: { md: "none", xs: "block" }, cursor: "pointer" }}
          onClick={() => {
            document.body.scrollIntoView({
              behavior: "smooth", // Smooth scrolling effect
            });
            dispatch(updateActiveUser(null));
          }}
        >
          <ArrowBackIcon />
        </Box>
        <UserAvatar image={props.user.image} name={props.user.name} />
        <Box>
          <Box fontWeight="bold">{props.user.name}</Box>
          <Box fontSize="12px" color="#888">
            {isOnline ? "Online" : "Offline"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ActiveUserHeader;
