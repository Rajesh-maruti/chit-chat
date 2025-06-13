import { createSlice } from "@reduxjs/toolkit";
import { UserDataType } from "../../components/UserContainer/UserList";

const initialState: { value: Array<UserDataType> } = { value: [] };
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUsers: function (state, action) {
      state.value = action.payload;
    },
  },
});

export const { updateUsers } = userSlice.actions;
export default userSlice.reducer;
