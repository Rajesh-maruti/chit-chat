import React, { useEffect } from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";
import LayoutContainer from "./Pages/ChatPage";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import OtpField from "./components/shared/OtpField";
import "./functions/firebase/index";
import { initializeApp } from "firebase/app";
import "./functions/firebase/index";
import { getAuth } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router";
import Otp from "./Pages/Otp";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  useEffect(() => {
    getAuth().useDeviceLanguage();
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route
              path="/chat"
              element={<PrivateRoute Component={<LayoutContainer />} />}
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
