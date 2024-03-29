import React, { useState, useContext } from "react";
import styles from "./Text.module.scss";

import Tooltip from "../../tooltip/Tooltip";

import InputIcon from "../../common/HOC/inputIcon/InputIcon";

const Text = (props) => {
  const {
    name,
    isDisabled: disabled,
    label,
    handleBlur,
    updateFieldData,
    setFieldValue,
    placeholder,
    error,
    touched,
    value,
    customStyles,
    decimalCount,
    disableReadOnlyMode,
    type,
    unit,
    serverFieldType,
  } = { ...props };

  const [readOnly, setReadOnly] = useState(true);

  const [inputValue, setInputValue] = useState({
    originalState: value || "",
    tempState: value || "",
  });
  const checkForDecimalCount = (value) => {
    if (!value || value === "") return value;
    let myVal = value;
    if (decimalCount && !isNaN(decimalCount)) {
      myVal =
        Math.round(+value * Math.pow(10, +decimalCount)) /
        Math.pow(10, +decimalCount);
    }
    return myVal;
  };
  const onKeyDown = (e) => {
    if (
      serverFieldType === "NUMBER" &&
      (event.key === "." || event.key === ",")
    ) {
      e.preventDefault();
      return;
    }
  };
  const inputChanged = (e) => {
    setInputValue({
      ...inputValue,
      tempState: e.target.value || "",
    });
  };
  const updateInput = () => {
    if (inputValue.tempState === inputValue.originalState) return;

    updateFieldData(checkForDecimalCount(inputValue.tempState));
  };
  const inputBlurred = (e) => {
    if (inputValue.tempState === inputValue.originalState) return;
    let updatedVal = {
      ...inputValue,
      tempState: checkForDecimalCount(inputValue.tempState),
    };

    if (inputValue) setInputValue({ ...updatedVal });

    setFieldValue(name, updatedVal.tempState);

    setTimeout(() => handleBlur(e), 10);
  };

  if (value && value !== inputValue.originalState) {
    setInputValue({ originalState: value, tempState: value });
  }
  let localStyles = {};
  if (unit) localStyles = { textAlign: "right", paddingRight: "8px" };
  const inputUI = (
    <div>
      <InputIcon endAdorment={unit} readOnly={readOnly && !disableReadOnlyMode}>
        <input
          style={{ ...customStyles, ...localStyles }}
          autoComplete="off"
          className={styles.input}
          {...{ name, disabled, label, type, value: inputValue.tempState }}
          placeholder={props.editAllowed ? placeholder : ""}
          readOnly={readOnly && !disableReadOnlyMode}
          onDoubleClick={() => setReadOnly(false || !props.editAllowed)}
          onKeyDown={onKeyDown}
          onChange={inputChanged}
          onBlur={(e) => {
            // onBlur(e);
            if (!props.editAllowed) return;
            setReadOnly(true);
            updateInput();
            setTimeout(() => inputBlurred(e));
          }}
        />
      </InputIcon>
    </div>
  );

  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        PopperProps={{
          disablePortal: true,
        }}
        placement="bottom-start"
      >
        {inputUI}
      </Tooltip>
    </React.Fragment>
  );
};

export default React.memo(Text);
