import React, { useState, useContext } from "react";
import styles from "./ScanQr.module.scss";

import Tooltip from "../../tooltip/Tooltip";
import { currencyFormatter } from "../../common/utility";
import QrReader from "./QrReader/QrReader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Dialog, makeStyles } from "@material-ui/core";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const ScanQr = (props) => {
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
      <FontAwesomeIcon icon={faCamera} className={styles.icon} />
    </div>
  );

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
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <QrReader onSubmit={inputChanged} onClose={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};

export default React.memo(ScanQr);
