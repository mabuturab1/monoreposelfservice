import React, { useState, useContext } from "react";
import styles from "./Currency.module.scss";

import Tooltip from "../../tooltip/Tooltip";
import { currencyFormatter } from "../../common/utility";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";

const Currency = (props) => {
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
    currency,
    thousandSep,
    decimalSep,
    unit,
  } = { ...props };

  const [readOnly, setReadOnly] = useState(true);

  const [inputValue, setInputValue] = useState({
    originalState: value || DummyInitValues["CURRENCY"],
    tempState: value || DummyInitValues["CURRENCY"],
  });
  const checkForDecimalCount = (value) => {
    let myVal = value;
    if (decimalCount && !isNaN(decimalCount)) {
      myVal =
        Math.round(+value * Math.pow(10, +decimalCount)) /
        Math.pow(10, +decimalCount);
    }
    return myVal;
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

  const inputUI = (
    <div>
      <InputIcon
        startAdorment={currency}
        endAdorment={unit}
        readOnly={readOnly}
      >
        <input
          style={customStyles}
          autoComplete="off"
          className={styles.input}
          {...{
            name,
            disabled,
            label,
            type,
            value:
              readOnly && !disableReadOnlyMode
                ? currencyFormatter(
                    inputValue.tempState,
                    currency,
                    thousandSep,
                    decimalSep,
                    decimalCount,
                    unit
                  )
                : inputValue.tempState,
          }}
          placeholder={props.editAllowed ? placeholder : ""}
          readOnly={readOnly && !disableReadOnlyMode}
          onDoubleClick={() => setReadOnly(false || !props.editAllowed)}
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
        placement="bottom-start"
        PopperProps={{
          disablePortal: true,
        }}
      >
        {inputUI}
      </Tooltip>
    </React.Fragment>
  );
};

export default React.memo(Currency);
