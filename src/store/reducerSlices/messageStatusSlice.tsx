import { createSlice } from "@reduxjs/toolkit";
import { ChatType } from "../../components/MessageContainer/MessageContent";

export type MessageOverviewType = {
  delivered: number;
  read: number;
  lastMessagedBy: string;
  lastMessage: ChatType;
  uid: string;
};
const initialState: {
  value: { [key: string]: MessageOverviewType };
} = {
  value: {},
};

export const messageStatusSlice = createSlice({
  name: "messageStatusReducer",
  initialState,
  reducers: {
    updateMessageStatus: (state, action) => {
      state.value[action.payload.uid] = action.payload;
    },
    setAllMessageStatus: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateMessageStatus, setAllMessageStatus } =
  messageStatusSlice.actions;

export default messageStatusSlice.reducer;
