import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";

const Input = (
  props: TextFieldProps & {
    onValueChange?: (value: string) => void;
    onEnter?: (value: string) => void;
    onKeyDown?: (value: React.KeyboardEvent) => void;
    disabled?: boolean;
    placeholder?: string;
  }
) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    props.onKeyDown?.(e);
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        props.onEnter?.(value);
        setValue("");
      }
    }
  };
  return (
    <Box width="100%">
      <TextField
        value={value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setValue(e.target.value);
          props.onValueChange?.(e.target.value);
        }}
        variant="outlined"
        sx={{
          width: "100%",
          border: "2px solid purple",
          borderRadius: "5px",
          outline: "none",
          "& input": {
            fontSize: "18px",
            height: "15px",
            "& ::placeholder": {
              fontSize: "18px",
              color: "rgb(117 117 157)",
              opacity: 1,
            },
            "& ::focus": {
              border: "none",
              outline: "none",
            },
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default Input;
