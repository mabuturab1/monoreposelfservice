import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./OfficerSelect.module.scss";
import InputBase from "@material-ui/core/InputBase";

import Tooltip from "../../tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
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

    MozBorderRadius: "0.6rem",
    WebkitBorderRadius: "0.6rem",
    padding: "3px 1.6rem 3px 0.75rem",
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

const OfficerSelect = (props) => {
  const {
    name,
    // label,
    value: mValue,
    error,
    touched,
    ignoreEditLocked,
    options: mOptions,

    setFieldValue,
    setFieldTouched,
    updateFieldData,
  } = {
    ...props,
  };
  let options = [];
  let valuesList = [];

  if (mOptions && mOptions.length > 0) {
    options = mOptions.map((el) => el.t);
    valuesList = mOptions.map((el) => el.i);
  }
  const currentValue =
    mValue && valuesList && valuesList.includes(mValue.i) ? mValue.i : "";
  const [selectValue, setSelectValue] = useState({
    originalState: currentValue,
    tempState: currentValue,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    if (!props.editAllowed) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value = null) => {
    setAnchorEl(null);
    if (value) setSelectValue({ ...selectValue, tempState: value });
    setTimeout(() => {
      setTimeout(() => setFieldTouched(name, true), 10);
      setTimeout(() => setFieldValue(name, value || selectValue.tempState), 10);
      if (value && selectValue.originalState === value) {
        return;
      } else if (value) updateFieldData(value);
    });
  };
  const classes = useStyles();
  let list = [];

  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      let localValue =
        valuesList && valuesList.length > i ? valuesList[i] : options[i];
      let classesValues = [classes.menuItem];
      if (currentValue === localValue) classesValues.push(styles.activeItem);
      list.push(
        <div key={i} onClick={() => handleClose(localValue)}>
          <MenuItem value={localValue} className={classesValues.join(" ")}>
            {options[i]}
          </MenuItem>
        </div>
      );
    }
  }
  if (mValue && currentValue !== selectValue.originalState)
    setSelectValue({
      originalState: currentValue,
      tempState: currentValue,
    });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div className={[classes.margin].join(" ")}>
      <div className={styles.inputWrapper}>
        <input
          className={[styles.text, styles.input].join(" ")}
          readOnly={true}
          onClick={handleClick}
          value={selectValue.tempState}
        />

        <FontAwesomeIcon
          icon={open ? faSortUp : faSortDown}
          className={styles.icon}
        />
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles.optionsWrapper}>{list}</div>
      </Popover>
    </div>
  );
  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched && !open) === true}
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
OfficerSelect.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
};
export default OfficerSelect;
