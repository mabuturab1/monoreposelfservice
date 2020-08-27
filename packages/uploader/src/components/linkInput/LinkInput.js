import React, { useState } from "react";
import StyledInput from "../styledInput/StyledInput";
const LinkInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const handleSubmit = () => {
    if (value.length > 0 && onSubmit) onSubmit(value);
  };
  return (
    <StyledInput
      headLabel={"Link "}
      style={{ width: 0, height: 0, overflow: "hidden" }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSubmit}
    />
  );
};
export default LinkInput;
