import React, { useState, useContext } from "react";
import styles from "./MyMap.module.scss";

import Tooltip from "../../tooltip/Tooltip";

import MapDialog from "./mapDialog/MapDialog";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Dialog, makeStyles } from "@material-ui/core";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const Map = (props) => {
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
    apiKey: mApiKey,
    customStyles,
    decimalCount,
    disableReadOnlyMode,
    type,
  } = { ...props };
  const classes = useStyles();

  const [readOnly, setReadOnly] = useState(true);
  const [open, setOpen] = React.useState(false);

  const handleClick = (event) => {
    console.log("setting open to true");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [inputValue, setInputValue] = useState({
    originalState: value,
    tempState: value,
  });

  const inputChanged = (value) => {
    setInputValue({
      ...inputValue,
      tempState: value || "",
    });
    setOpen(false);
  };
  const updateInput = () => {
    if (inputValue.tempState === inputValue.originalState) return;

    // updateFieldData(inputValue.tempState);
  };
  const inputBlurred = (e) => {
    if (inputValue.tempState === inputValue.originalState) return;
    let updatedVal = {
      ...inputValue,
      tempState: inputValue.tempState,
    };

    if (inputValue) setInputValue({ ...updatedVal });

    setFieldValue(name, updatedVal.tempState);

    setTimeout(() => handleBlur(e), 10);
  };

  if (value !== inputValue.originalState) {
    setInputValue({ originalState: value, tempState: value });
  }

  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div className={styles.inputWrapper} onClick={handleClick}>
      <InputIcon icon={faMapMarkerAlt}>
        <input
          style={customStyles}
          autoComplete="off"
          className={styles.input}
          {...{ name, disabled, label, type, value: inputValue.tempState }}
          placeholder={props.editAllowed ? placeholder : ""}
          readOnly={true}
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
  console.log("in my map value is", value);
  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
      >
        {inputUI}
      </Tooltip>

      <Dialog
        title={"Qr Reader"}
        id={id}
        maxWidth={"lg"}
        classes={{
          paper: classes.paper,
        }}
        disableBackdropClick={true}
        open={open}
        onClose={handleClose}
      >
        <MapDialog
          apiKey={mApiKey}
          onSubmit={inputChanged}
          onClose={handleClose}
          {...{ value }}
        />
      </Dialog>
    </React.Fragment>
  );
};

export default React.memo(Map);
