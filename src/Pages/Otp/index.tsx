import Typography from "@mui/material/Typography";
import OtpField from "../../components/shared/OtpField";
import CardView from "../../Layout/CardView";
import { phoneNumberFunctions } from "../../functions/firebase/phoneNumberFunctions";
import { useDispatch } from "react-redux";
import { login } from "../../store/reducerSlices/loginSlice";
import { UserCredential } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../functions/firebase";
import { toast } from "react-toastify";
import { updateAccount } from "../../store/reducerSlices/accountSlice";
import { manageUser } from "../../functions/firebase/manageUser";

const Otp = () => {
  const [q, f] = useSearchParams();
  const name = q.get("name");
  const phoneNumber = q.get("phoneNumber");

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const onOtpSuccessfulVerification = async (loginData: UserCredential) => {
    if (name && phoneNumber) {
      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef), {
        name: name,
        mobileNumber: phoneNumber,
      });
      toast.success("User Registered!");
    }
    dispatch(login(loginData));
    manageUser.getCurrentSignedInUser((user) => {
      dispatch(updateAccount(user));
      navigator("/chat");
    });
  };

  const handleOtpSubmission = (otp: string) => {
    phoneNumberFunctions.signInWithVerificationCode(
      otp,
      onOtpSuccessfulVerification,
      (e) => {
      }
    );
  };
  return (
    <CardView>
      <Typography variant="h6" fontStyle="italic">
        Enter OTP
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We have sent you an OTP to your registered phone number.
      </Typography>
      <OtpField onSubmit={handleOtpSubmission} />
    </CardView>
  );
};

export default Otp;
