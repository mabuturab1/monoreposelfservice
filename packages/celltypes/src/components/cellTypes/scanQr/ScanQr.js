import React, { useState, useContext } from "react";
import styles from "./ScanQr.module.scss";

import Tooltip from "../../tooltip/Tooltip";
import { currencyFormatter } from "../../common/utility";
import QrReader from "./QrReader/QrReader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Dialog, makeStyles } from "@material-ui/core";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";
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
    setFieldTouched,
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
    if (!props.editAllowed) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [inputValue, setInputValue] = useState({
    originalState: value || DummyInitValues["SCAN_QR"],
    tempState: value || DummyInitValues["SCAN_QR"],
  });

  const inputChanged = (value) => {
    console.log("input changed qr", value);
    setInputValue({
      ...inputValue,
      tempState: value || "",
    });
    setOpen(false);
    console.log("edit allowed", props.editAllowed);
    if (!props.editAllowed) return;
    setReadOnly(true);
    updateInput(value);
    setTimeout(() => inputBlurred(value));
  };
  const updateInput = (value) => {
    console.log(
      "updating field data in scan QR",
      inputValue.tempState,
      inputValue.originalState
    );
    if (value === inputValue.originalState) return;
    console.log("updating field data in scan QR", inputValue.tempState);
    updateFieldData(value);
  };
  const inputBlurred = (value) => {
    if (value === inputValue.originalState) return;
    let updatedVal = {
      ...inputValue,
      tempState: value,
    };

    setFieldValue(name, updatedVal.tempState);
    setFieldTouched(name, true);
    // setTimeout(() => handleBlur(e), 10);
  };

  if (value && value !== inputValue.originalState) {
    setInputValue({ originalState: value, tempState: value });
  }
  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div onClick={handleClick}>
      <InputIcon icon={faCamera}>
        <input
          style={customStyles}
          autoComplete="off"
          className={styles.input}
          {...{ name, disabled, label, type, value: inputValue.tempState }}
          placeholder={props.editAllowed ? placeholder : ""}
          readOnly={true}
          onBlur={(e) => {
            // onBlur(e);
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
      >
        {inputUI}
      </Tooltip>
      <Dialog
        title={"Qr Reader"}
        disableBackdropClick={true}
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open && props.editAllowed}
        onClose={handleClose}
      >
        <QrReader onSubmit={inputChanged} onClose={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};

export default React.memo(ScanQr);
