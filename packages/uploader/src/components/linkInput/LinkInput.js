import React, { useState } from "react";
import StyledInput from "../styledInput/StyledInput";
const LinkInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const handleSubmit = () => {
    if (value.length > 0 && onSubmit) onSubmit(value);
  };
  return (
    <StyledInput
      style={{
        width: "100%",
        height: "100%",
        outline: "none",
        border: "none",
      }}
      headLabel={"Link "}
      type="text"
      placeholder="Kindly enter a valid Youtube url"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSubmit}
    />
  );
};
export default LinkInput;
