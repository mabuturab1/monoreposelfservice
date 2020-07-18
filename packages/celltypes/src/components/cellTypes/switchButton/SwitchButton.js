import React, { useContext, useState } from "react";

import Tooltip from "../../tooltip/Tooltip";
import { Switch } from "@material-ui/core";

const SwitchButton = (props) => {
  const {
    name,
    isDisabled: disabled,
    label,
    handleBlur: onBlur,
    handleChange: onChange,
    setFieldValue,

    placeholder,
    type,
    value,
    error,
    touched,
    updateFieldData,
  } = { ...props };
  const [inputValue, setInputValue] = useState({
    originalState: parseInt(value || 0),
    tempState: parseInt(value || 0),
  });
  if (value > 0 && parseInt(value) !== inputValue.originalState) {
    setInputValue({
      originalState: parseInt(value || 0),
      tempState: parseInt(value || 0),
    });
  }
  const switchUI = (
    <Switch
      onChange={(e) => {
        if (e.currentTarget.value === inputValue.originalState) return;
        updateFieldData(e.currentTarget.value);
        setInputValue({
          ...inputValue,
          tempState: e.currentTarget.value,
        });
        let currentValue = e.currentTarget.value;
        e.persist();
        setTimeout(() => {
          setFieldValue(name, currentValue);
          setTimeout(() => onBlur(e), 10);
        });
      }}
      {...{
        name,
        disabled,
        label,
        onBlur,

        checked: inputValue.tempState,
      }}
      color="primary"
      inputProps={{ "aria-label": "primary checkbox" }}
    />
  );

  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
      >
        {switchUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default SwitchButton;
