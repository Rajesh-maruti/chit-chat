import Box from "@mui/material/Box";
import Input from "../../Input";
import { useEffect, useRef } from "react";
import { TextFieldProps } from "@mui/material";

const Otp = (
  props: {
    otp: string;
    focus?: boolean;
    onKeyDown?: (e: React.KeyboardEvent) => void;
  } & TextFieldProps
) => {
  const ref = useRef<null | HTMLInputElement>(null);

  const inputStyle: React.CSSProperties = {
    fontSize: "25px",
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
  };

  useEffect(() => {
    if (props.focus) {
      ref.current?.focus();
    }
  }, [props.focus]);

  return (
    <Box maxWidth="70px">
      <Input
        inputRef={ref}
        variant="standard"
        sx={{ border: "2px solid purple 2px", "& input": inputStyle }}
        slotProps={{ htmlInput: { maxLength: 1 } }}
        onKeyDown={props.onKeyDown}
        value={props.otp}
        {...props}
      />
    </Box>
  );
};

export default Otp;
