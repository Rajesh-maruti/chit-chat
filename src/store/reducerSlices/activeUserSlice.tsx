import { createSlice } from "@reduxjs/toolkit";
import { UserDataType } from "../../components/UserContainer/UserList";

const initialState: { value: UserDataType | null } = { value: null };

export const activeUserSlice = createSlice({
  name: "activeUserData",
  initialState,
  reducers: {
    updateActiveUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateActiveUser } = activeUserSlice.actions;

export default activeUserSlice.reducer;
