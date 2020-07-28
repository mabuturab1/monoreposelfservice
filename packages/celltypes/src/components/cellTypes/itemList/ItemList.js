import React, { useState } from "react";

import StyledInput from "../../common/styledInput/StyledInput";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";

const ItemList = ({ value: mValue }) => {
  return (
    <div>
      <InputIcon icon={faListAlt}>
        <StyledInput value={"View ItemList"} readOnly={true} />
      </InputIcon>
    </div>
  );
};
export default ItemList;
