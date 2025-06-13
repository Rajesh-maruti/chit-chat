import { useState } from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";

const PhoneNumberInput = (props: PhoneInputProps) => {
  const [value, setValue] = useState("");

  return (
    <PhoneInput
      placeholder="Enter phone number"
      value={value}
      autoFormat
      disableCountryCode
      disableDropdown
      onChange={setValue}
      inputStyle={{
        height: "40px",
        fontSize: "18px",
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        border: "2px solid purple",
        width: "100%",
        padding: "25px 48px",
      }}
      country="in"
      buttonStyle={{
        border: "2px solid purple",
      }}
      {...props}
    />
  );
};
export default PhoneNumberInput;
