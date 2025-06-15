import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

export type AccountSlice = { value: User | null };
const initialState: AccountSlice = { value: null };
export const accountSlice = createSlice({
  name: "accountSlice",
  initialState: initialState,
  reducers: {
    updateAccount: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateAccount } = accountSlice.actions;
export default accountSlice.reducer;
