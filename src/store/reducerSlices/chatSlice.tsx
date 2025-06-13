import { createSlice } from "@reduxjs/toolkit";
import { ChatType } from "../../components/MessageContainer/MessageContent";

const initialState: { value: Array<ChatType> } = {
  value: [],
};

export const chatSlice = createSlice({
  name: "chatReducer",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log(state.value,'statestate')
      state.value.push(action.payload);
    },

    updatePreviousMessage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addMessage, updatePreviousMessage } = chatSlice.actions;

export default chatSlice.reducer;
