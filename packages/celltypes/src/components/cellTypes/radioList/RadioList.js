import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./Dropdown.module.scss";
import InputBase from "@material-ui/core/InputBase";

import Tooltip from "../../tooltip/Tooltip";
import { Popover } from "@material-ui/core";
const BootstrapInput = withStyles((theme) => ({
  root: {
    minWidth: "5rem",

    fontFamily: "Open Sans",
    "label + &": {
      marginTop: theme.spacing(1),
    },
  },

  input: {
    borderRadius: 4,
    position: "relative",

    outline: "none",
    border: "none",

    color: "#4a4a4a",
    fontWeight: "500",
    fontSize: "0.8rem",
    backgroundColor: "transparent",

    MozBorderRadius: "10px",
    WebkitBorderRadius: "10px",
    padding: "3px 26px 3px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Roboto", "sans-serif"].join(","),
    "&:focus": {
      borderRadius: 4,
      background: "none",

      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  menuItem: {
    color: "#4a4a4a",
    fontWeight: "500",
    fontSize: "0.8rem",
    backgroundColor: "transparent",
    fontFamily: "'Roboto','sans-serif'",
  },
}));

const Dropdown = (props) => {
  const {
    name,
    // label,
    value,
    error,
    touched,
    ignoreEditLocked,
    options,
    valuesList,
    setFieldValue,
    setFieldTouched,
    updateFieldData,
  } = {
    ...props,
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleDataSubmit();
  };
  const currentValue =
    (valuesList && valuesList.includes(value)) ||
    (!valuesList && options && options.includes(value))
      ? value
      : "";
  const [selectValue, setSelectValue] = useState({
    originalState: currentValue,
    tempState: currentValue,
  });
  const classes = useStyles();
  let list = [];

  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      let localValue =
        valuesList && valuesList.length > i ? valuesList[i] : options[i];
      list.push(
        <Radio
          key={i}
          checked={selectValue.tempState === localValue}
          onChange={handleChange}
          value={localValue}
          name={name}
          inputProps={{ "aria-label": "A" }}
        />
      );
    }
  }
  if (currentValue !== selectValue.originalState)
    setSelectValue({
      originalState: currentValue,
      tempState: currentValue,
    });
  const open = Boolean(anchorEl) && props.editAllowed;
  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div className={[classes.margin].join(" ")}>
      {/* <InputLabel id="select-label">{label}</InputLabel> */}
      <input
        value={selectValue.tempState}
        readOnly={true}
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {list}
      </Popover>
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
    </React.Fragment>
  );
};
Dropdown.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
};
export default Dropdown;
