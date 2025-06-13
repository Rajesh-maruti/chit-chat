import {
  getAuth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";
import toast from "../toast";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export const phoneNumberFunctions = {
  auth: getAuth,
  defaultLaung: function () {
    this.auth().useDeviceLanguage();
  },
  invisbleCaptcha: function (
    buttonId: string,
    onSignInSubmit?: (data: any) => void
  ) {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.render();
    } else {
      window.recaptchaVerifier = new RecaptchaVerifier(this.auth(), buttonId, {
        size: "invisible",
        callback: (response: any) => {
          onSignInSubmit?.(response);
        },
      });
    }
    return window.recaptchaVerifier;
  },

  visbleCaptchaVerification: function (buttonId: string) {
    window.recaptchaVerifier = new RecaptchaVerifier(this.auth(), buttonId, {});
  },

  sendCodeToUserPhone: function (
    phoneNumber: string,
    onCodeSent?: (data: ConfirmationResult) => void,
    onError?: (error: any) => void
  ) {
    signInWithPhoneNumber(this.auth(), phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("Code sent successfully");
        onCodeSent?.(confirmationResult);
      })
      .catch((error) => {
        toast.error(error.message);
        onError?.(error);
      });
  },
  signInWithVerificationCode: function (
    code: string,
    onSingIn: (data: UserCredential) => void,
    onerror?: (error: any) => void
  ) {
    window.confirmationResult
      ?.confirm(code)
      .then((result) => {
        toast.success("OTP Validated!!");
        onSingIn(result);
      })
      .catch((error) => {
        toast.error(error.message);
        onerror?.(error);
      });
  },
};
