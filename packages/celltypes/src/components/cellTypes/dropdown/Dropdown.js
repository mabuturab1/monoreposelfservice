import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./Dropdown.module.scss";
import InputBase from "@material-ui/core/InputBase";

import Tooltip from "../../tooltip/Tooltip";
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
    customStyles,
    disableReadOnlyMode,
  } = {
    ...props,
  };

  const currentValue =
    value &&
    ((valuesList && valuesList.includes(value)) ||
      (!valuesList && options && options.includes(value)))
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
      list.push(
        <MenuItem
          key={i}
          value={
            valuesList && valuesList.length > i ? valuesList[i] : options[i]
          }
          className={classes.menuItem}
        >
          {options[i]}
        </MenuItem>
      );
    }
  }
  if (value && currentValue !== selectValue.originalState)
    setSelectValue({
      originalState: currentValue,
      tempState: currentValue,
    });
  const inputUI = (
    <div className={[classes.margin].join(" ")} style={{ margin: "0px" }}>
      {/* <InputLabel id="select-label">{label}</InputLabel> */}
      <Select
        style={customStyles}
        labelId="select-label"
        id="select"
        className={styles.selectStyle}
        value={selectValue.tempState}
        readOnly={
          !props.editAllowed && !ignoreEditLocked && !disableReadOnlyMode
        }
        onChange={(e) => {
          setSelectValue({ ...selectValue, tempState: e.target.value });
          if (updateFieldData) updateFieldData(e.target.value);
          setTimeout(() => setFieldValue(name, e.target.value));
          setTimeout(() => setFieldTouched(name, true), 10);
        }}
        input={<BootstrapInput />}
      >
        {list}
      </Select>
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
