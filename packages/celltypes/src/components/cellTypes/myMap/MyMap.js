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
    setFieldTouched,
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
    if (!props.editAllowed) return;
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
    handleClose();
    let newValue = {
      lat: value.lat,
      long: value.lng || value.long,
    };
    if (!props.editAllowed) return;
    setInputValue({
      ...inputValue,
      tempState: newValue || "",
    });
    setReadOnly(true);
    updateInput(newValue);

    setTimeout(() => inputBlurred(newValue));
    console.log("obtained data is", inputValue, newValue);
  };

  const updateInput = (value) => {
    let { lat, long } = value;
    let { lat: latOrig, long: longOrig } = inputValue.originalState;
    if (!lat || !long) return;
    console.log("checking for lat,long", lat, long, latOrig, longOrig);
    console.log(lat === latOrig && long === longOrig);
    if (lat === latOrig && long === longOrig) return;

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

  if (value !== inputValue.originalState) {
    setInputValue({ originalState: value, tempState: value });
  }
  const getFormattedValue = (location) => {
    if (!location || !location.lat || !location.long) return "";
    return `lat: ${location.lat}, long:${location.long}`;
  };
  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div onClick={handleClick}>
      <InputIcon icon={faMapMarkerAlt}>
        <input
          style={customStyles}
          autoComplete="off"
          className={styles.input}
          {...{
            name,
            disabled,
            label,
            type,
            value: getFormattedValue(inputValue.tempState),
          }}
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
        title={"Maps"}
        id={id}
        maxWidth={"lg"}
        classes={{
          paper: classes.paper,
        }}
        disableBackdropClick={true}
        open={open && props.editAllowed}
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
