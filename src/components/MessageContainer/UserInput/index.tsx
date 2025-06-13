import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { ChatType } from "../MessageContent";
import MessageActions from "./MessageActions";
import FileInput from "../../shared/FileInput";
import useChat from "../../../functions/firebase/useChat";
import { RootState } from "../../../store";
import useFileUpload from "../../../functions/firebase/useFileUpload";
import { StorageReference } from "firebase/storage";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import useGetOnlineStatus from "../../../hooks/useGetOnlineStatus";
import { manageUser } from "../../../functions/firebase/manageUser";

const UserInput = () => {
  const chatLength = useSelector(
    (state: RootState) => state.chats.value.length
  );
  const [uploadPercentage, setUploadPercentage] = useState<string | null>(null);
  const receiverUser = useSelector(
    (state: RootState) => state.activeUser.value
  );
  const isNewChat =
    useSelector((state: RootState) => state.chats.value)?.length === 0;

  const loggedInUser = useSelector((state: RootState) => state.account.value);
  const { updateChat } = useChat();
  const { getUserStatus } = useGetOnlineStatus();
  const { uploadImage, uploadVideo, getDownLoadUrl } = useFileUpload({
    onProgressChange: (progress) => {
      setUploadPercentage(progress.toFixed(2));
    },
    onUploadError: () => {
      setUploadPercentage(null);
    },
  });
  const handleGenericValues = () => {
    return {
      id: chatLength + 1,
      time: new Date().toLocaleString("en-US", {
        timeStyle: "short",
        dateStyle: "short",
      }),
    };
  };

  const onMessageSent = async (value: string) => {
    if (!receiverUser?.phoneNumber) return;
    const data = await getUserStatus(`${receiverUser?.phoneNumber}`);
    const message: ChatType = {
      ...handleGenericValues(),
      message: { type: "text", value },
      messageStatus: data?.online ? "delivered" : "sent",
      sentBy: loggedInUser?.phoneNumber!,
    };
    const loggedInUserInSenderList = (
      await manageUser.getChatUsers(receiverUser.phoneNumber)
    )?.find((each) => each.phoneNumber === loggedInUser?.phoneNumber);
    if (isNewChat && !loggedInUserInSenderList?.phoneNumber) {
      await manageUser.addNewUserToChat(
        `${receiverUser?.phoneNumber}`,
        loggedInUser?.phoneNumber!
      );
      manageUser.reloadUserList(`${receiverUser?.phoneNumber}`);
    }
    updateChat(message, `${receiverUser?.phoneNumber}`);
  };

  const onUpload = async (ref: StorageReference, type: "image" | "video") => {
    if (!receiverUser?.phoneNumber) return;
    const data = await getUserStatus(`${receiverUser?.phoneNumber}`);
    const downLoadUrl = await getDownLoadUrl(ref);
    let url = downLoadUrl;
    const message: ChatType = {
      ...handleGenericValues(),
      message: { type: "image", value: url },
      messageStatus: data?.online ? "delivered" : "sent",
      sentBy: loggedInUser?.phoneNumber!,
    };
    const loggedInUserInSenderList = (
      await manageUser.getChatUsers(receiverUser.phoneNumber)
    )?.find((each) => each.phoneNumber === loggedInUser?.phoneNumber);
    if (isNewChat && !loggedInUserInSenderList?.phoneNumber) {
      await manageUser.addNewUserToChat(
        `${receiverUser?.phoneNumber}`,
        loggedInUser?.phoneNumber!
      );
      manageUser.reloadUserList(`${receiverUser?.phoneNumber}`);
    }
    updateChat(message, `${receiverUser?.phoneNumber!}`);
    setUploadPercentage(null);
  };

  const handleFileChange = async (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image")) {
      const imageTask = uploadImage(file, async () => {
        onUpload(imageTask.snapshot.ref, "image");
      });
    } else if (fileType.startsWith("video")) {
      const videoTask = uploadVideo(file, async () => {
        onUpload(videoTask.snapshot.ref, "video");
      });
    }
  };

  return (
    <Box
      position="sticky"
      bottom={0}
      display="flex"
      alignItems="center"
      zIndex={1}
      sx={{ backgroundColor: "white" }}
      px={2}
      py={2}
    >
      {uploadPercentage ? (
        <Box position="relative" p={1}>
          <Typography
            variant="body2"
            position="absolute"
            top="30%"
            fontSize="10px"
            left="22%"
          >
            {uploadPercentage}%
          </Typography>
          <CircularProgress
            variant="determinate"
            value={Number(uploadPercentage)}
          />
        </Box>
      ) : (
        <FileInput onFileChange={(e) => handleFileChange(e?.[0])} />
      )}
      <MessageActions onSend={onMessageSent} />
    </Box>
  );
};

export default UserInput;
