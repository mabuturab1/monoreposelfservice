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
    originalState: value || false,
    tempState: value || false,
  });
  if (value != null && value !== inputValue.originalState) {
    setInputValue({
      originalState: value || false,
      tempState: value || false,
    });
  }
  const switchUI = (
    <Switch
      onChange={(e) => {
        console.log(
          "current taget value",

          e.currentTarget,
          e.currentTarget.checked
        );
        if (e.currentTarget.value === inputValue.originalState) return;
        updateFieldData(e.currentTarget.checked);
        setInputValue({
          ...inputValue,
          tempState: e.currentTarget.checked,
        });
        let currentValue = e.currentTarget.checked;
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
