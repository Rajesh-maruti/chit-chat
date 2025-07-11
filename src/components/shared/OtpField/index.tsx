import Box from "@mui/material/Box";
import { useState } from "react";
import Otp from "./Otp";
import { Button } from "@mui/material";

const OtpField = (props: { onSubmit: (otp: string) => Promise<void> }) => {
  const [otps, setOtps] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setIsLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let temp = [...otps];
    if (e.key === "Backspace") {
      temp[index] = "";
      setOtps(temp);
      setFocusedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    } else if (!isNaN(Number(e.key))) {
      temp[index] = e.key;
      setOtps(temp);
      setFocusedIndex((prev) =>
        prev === otps.length - 1 ? otps.length - 1 : prev + 1
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        gap={1}
        p={2}
        alignItems="center"
        justifyContent="center"
      >
        {otps?.map((item, index) => (
          <Otp
            onFocus={() => setFocusedIndex(index)}
            otp={item}
            focus={focusedIndex === index}
            key={index}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        color="secondary"
        disabled={otps.includes("")}
        loading={loading}
        onClick={async () => {
          setIsLoading(true);
          await props.onSubmit(otps.join(""));
          setIsLoading(false);
        }}
      >
        Verify
      </Button>
    </Box>
  );
};

export default OtpField;
