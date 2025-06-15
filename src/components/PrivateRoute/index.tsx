import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import toast from "../../functions/toast";

const PrivateRoute = (props: { Component: JSX.Element }) => {
  const loginData = useSelector((state: RootState) => state.login.value);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenExpireIn = Number(
      loginData?.user?.stsTokenManager?.expirationTime
    );
    const idToken = loginData?._tokenResponse?.idToken;

    if (!idToken || !tokenExpireIn || tokenExpireIn <= Date.now()) {
      localStorage.clear();
      navigator("/");
    }

    const timeout = setTimeout(() => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        currentUser
          .getIdToken()
          .then(function (token) {
            // dispatch(
            //   login({
            //     ...loginData,
            //     user: {
            //       ...loginData.user,
            //       lastLoginAt: Date.now(),
            //     },
            //     _tokenResponse: {
            //       ...loginData._tokenResponse,
            //       idToken: token,
            //     },
            //   } satisfies UserCredential)
            // );
            clearTimeout(timeout);
          })
          .catch(function () {
            toast.error("Something went wrong!");
            navigator("/");
          });
      }
    }, Date.now() - tokenExpireIn - 60 * 1000 * 5);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigator, loginData, dispatch]);

  return props.Component;
};

export default PrivateRoute;
