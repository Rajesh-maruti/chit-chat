import { createSlice } from "@reduxjs/toolkit";
import { UserCredential } from "firebase/auth";

const initialState: {
  value: any;
} = { value: null };

export const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = null;
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
