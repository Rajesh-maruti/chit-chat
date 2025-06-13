import { configureStore } from "@reduxjs/toolkit";
import activeUserReducer from "./reducerSlices/activeUserSlice";
import chatSliceReducer from "./reducerSlices/chatSlice";
import userReducer from "./reducerSlices/userSlice";
import loginReducer from "./reducerSlices/loginSlice";
import accountReducer from "./reducerSlices/accountSlice";
import messageStatusSlice from "./reducerSlices/messageStatusSlice";

const reHydrateStore = () => {
  const data = localStorage.getItem("data");
  if (data !== null) {
    return JSON.parse(data); // re-hydrate the store
  }
};

const authMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  const authState = storeAPI.getState();
  localStorage.setItem(
    "data",
    JSON.stringify({
      login: authState.login,
      account: authState.account,
    })
  );
  return result;
};

export const store = configureStore({
  reducer: {
    activeUser: activeUserReducer,
    chats: chatSliceReducer,
    userList: userReducer,
    login: loginReducer,
    account: accountReducer,
    messageStatus: messageStatusSlice,
  },
  preloadedState: {
    login: reHydrateStore()?.login,
    account: reHydrateStore()?.account,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
