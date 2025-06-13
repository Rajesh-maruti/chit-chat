import { ReactNode } from "react";
import { toast as toastEmiiter, ToastOptions, Bounce } from "react-toastify";

const toast = () => {
  const defaultoast = (props: ToastOptions & { message: string | ReactNode }) =>
    toastEmiiter(props.message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
      ...props,
    });

  const success = (message: string | ReactNode, options?: ToastOptions) => {
    return defaultoast({ message, type: "success", ...options });
  };
  const error = (message: string | ReactNode, options?: ToastOptions) => {
    return defaultoast({ message, type: "error", ...options });
  };
  const info = (message: string | ReactNode, options?: ToastOptions) => {
    return defaultoast({ message, type: "info", ...options });
  };
  const warning = (message: string | ReactNode, options?: ToastOptions) => {
    return defaultoast({ message, type: "warning", ...options });
  };
  const loading = (message: string | ReactNode, options?: ToastOptions) => {
    return defaultoast({ message, type: "default", ...options });
  };

  return { success, error, info, warning, loading };
};

export default toast();
