import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import Input from "../../components/shared/Input";
import PhoneNumberInput from "../../components/shared/PhoneNumberInput";
import { phoneNumberFunctions } from "../../functions/firebase/phoneNumberFunctions";
import toast from "../../functions/toast";
import { RecaptchaVerifier } from "firebase/auth";
import { Link, useNavigate } from "react-router";
import CardView from "../../Layout/CardView";
import { db } from "../../functions/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { manageUser } from "../../functions/firebase/manageUser";

const SignUp = () => {
  const [formState, setFormState] = useState({
    name: "",
    phoneNumber: "",
  });
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCaptchaVerification = () => {
    phoneNumberFunctions.invisbleCaptcha("signUpButton");
  };

  const loadingComlpetes = () => {
    setIsLoading(false);
  };

  const handleSuccessOtp = async () => {
    loadingComlpetes();

    navigate(
      `/otp?name=${formState.name}&phoneNumber=+91${formState.phoneNumber}`
    );
  };

  const handleSubmit = async () => {
    const isMobileNumberRegistered = !!(await manageUser.phoneNumberExist(
      `91${formState.phoneNumber}`
    ));

    if (isMobileNumberRegistered) {
      return toast.error("Mobile Number registered! Please login");
    }

    setIsLoading(true);
    handleCaptchaVerification();
    phoneNumberFunctions.sendCodeToUserPhone(
      "+91" + formState.phoneNumber,
      handleSuccessOtp,
      loadingComlpetes
    );
  };

  return (
    <CardView>
      <Typography variant="h6" color="secondary" fontWeight="bold">
        Register to Continue.
      </Typography>
      <Input
        placeholder="Name"
        variant="outlined"
        color="secondary"
        value={formState.name}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <PhoneNumberInput
        onlyCountries={["in"]}
        value={formState.phoneNumber}
        onChange={(e) => {
          setFormState((prev) => ({
            ...prev,
            phoneNumber: e,
          }));
        }}
      />
      <Box width="100%" py={3}>
        <Button
          variant="contained"
          color="secondary"
          id="signUpButton"
          sx={{ width: "100%", fontWeight: "bold", fontSize: "16px" }}
          disabled={!formState.name || formState.phoneNumber.length !== 10}
          loading={isLoading}
          loadingPosition="start"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          width="100%"
          display="flex"
          justifyContent="center"
        >
          Already Registered?
        </Typography>
        <Typography
          py={1}
          variant="body2"
          color="text.secondary"
          width="100%"
          display="flex"
          justifyContent="center"
          fontWeight="bold"
        >
          <Link to="/">
            <Button color="secondary">Login</Button>
          </Link>
        </Typography>
      </Box>
    </CardView>
  );
};

export default SignUp;
