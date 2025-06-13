import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";
import LoginIcon from "@mui/icons-material/Login";
import PhoneNumberInput from "../../components/shared/PhoneNumberInput";
import { Link, useNavigate } from "react-router";
import CardView from "../../Layout/CardView";
import { manageUser } from "../../functions/firebase/manageUser";
import toast from "../../functions/toast";
import { phoneNumberFunctions } from "../../functions/firebase/phoneNumberFunctions";
const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loadingComlpetes = () => {
    setIsLoading(false);
  };

  const handleSuccessOtp = async () => {
    loadingComlpetes();
    navigate(`/otp`);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const isExistedUser = await manageUser.phoneNumberExist(phoneNumber);
    if (!isExistedUser) {
      return toast.error("User not registered! Please signup.");
    }
    phoneNumberFunctions.invisbleCaptcha("signInButton");
    phoneNumberFunctions.sendCodeToUserPhone(
      "+" + phoneNumber,
      handleSuccessOtp,
      loadingComlpetes
    );
  };
  return (
    <CardView>
      <Typography variant="h6" color="secondary" fontWeight="bold">
        Login to Continue.
      </Typography>

      <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} />
      <Box width="100%" py={3}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "100%", fontWeight: "bold", fontSize: "16px" }}
          onClick={handleSubmit}
          loading={loading}
          id="signInButton"
        >
          Login <LoginIcon />
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
          OR
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
          <Link to="/sign-up">
            <Button color="secondary">Sign Up</Button>
          </Link>
        </Typography>
      </Box>
    </CardView>
  );
};

export default Login;
