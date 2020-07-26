import React, { useContext, useState } from "react";
import Rating from "@material-ui/lab/Rating";
import Tooltip from "../../tooltip/Tooltip";

const MyRating = (props) => {
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
    disableReadOnlyMode,
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

  const ratingUI = (
    <Rating
      readOnly={!props.editAllowed && !disableReadOnlyMode}
      // className={styles.input}
      onChange={(e) => {
        if (parseInt(e.currentTarget.value) === inputValue.originalState)
          return;
        updateFieldData(parseInt(e.currentTarget.value));
        setInputValue({
          ...inputValue,
          tempState: parseInt(e.currentTarget.value),
        });
        let currentValue = parseInt(e.currentTarget.value);
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

        placeholder,
        type,
        value: inputValue.tempState,
      }}
      onBlur={(e) => {
        onBlur(e);
      }}
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
        {ratingUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default MyRating;
