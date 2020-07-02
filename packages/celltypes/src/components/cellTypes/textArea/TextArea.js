import React, { useState, useContext } from "react";
import styles from "./TextArea.module.scss";
import Tooltip from "../../tooltip/Tooltip";

const TextArea = (props) => {
  const {
    name,
    isDisabled: disabled,
    label,
    handleBlur,
    updateFieldData,
    setFieldValue,
    placeholder,
    value,
    error,
    touched,
  } = { ...props };
  // console.log("in textArea", name, error, touched);
  const [readOnly, setReadOnly] = useState(true);
  const [inputValue, setInputValue] = useState({
    originalState: value,
    tempState: value,
  });
  const inputChanged = (e) => {
    setInputValue({
      ...inputValue,
      tempState: e.target.value || "",
    });
  };
  const updateInput = () => {
    if (
      inputValue.tempState === inputValue.originalState ||
      (error && touched) === true
    )
      return;
    updateFieldData(inputValue.tempState);
  };
  const inputBlurred = (e) => {
    if (
      inputValue.tempState === inputValue.originalState ||
      (error && touched) === true
    )
      return;
    setInputValue({ ...inputValue });
    setFieldValue(name, inputValue.tempState);

    setTimeout(() => handleBlur(e), 10);
  };
  if (value !== inputValue.originalState) {
    setInputValue({ originalState: value, tempState: value });
  }
  const inputUI = (
    <textarea
      className={styles.textArea}
      spellCheck="false"
      {...{
        name,
        disabled,
        label,

        value: inputValue.tempState,
      }}
      placeholder={props.editAllowed ? placeholder : ""}
      readOnly={readOnly}
      onDoubleClick={() => setReadOnly(false || !props.editAllowed)}
      onChange={inputChanged}
      onBlur={(e) => {
        // onBlur(e);

        setReadOnly(true);
        updateInput();
        setTimeout(() => inputBlurred(e));
      }}
    />
  );
  const readOnlyInputUI = (
    <div
      className={styles.textArea}
      onDoubleClick={() => setReadOnly(false || !props.editAllowed)}
    >
      {inputValue.tempState && inputValue.tempState.length > 0 ? (
        <span>{inputValue.tempState}</span>
      ) : (
        <span style={{ fontWeight: 400, opacity: 0.6 }}>{placeholder}</span>
      )}
    </div>
  );

  // Object.keys(data).forEach((el) => {
  //   if (!(el in dummyTextArea)) delete updatedData[el];
  // });
  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
      >
        {readOnly ? readOnlyInputUI : inputUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default TextArea;
