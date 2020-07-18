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
  } = {
    ...props,
  };
  const currentValue =
    (valuesList && valuesList.includes(value)) ||
    (!valuesList && options && options.includes(value))
      ? value
      : "";
  const getCurrentValueStatus = (val) => {
    return (
      ((valuesList && valuesList.includes(val)) ||
        (!valuesList && options && options.includes(val))) &&
      value.includes(val)
    );
  };
  const isValidValue = (val) => {
    return (
      (valuesList && valuesList.includes(val)) ||
      (!valuesList && options && options.includes(val))
    );
  };
  let currentValue = value.filter((el) => isValidValue(el));
  const [selectValue, setSelectValue] = useState({
    originalState: currentValue,
    tempState: currentValue,
  });
  const classes = useStyles();
  let list = [];
  const checkboxValueChanged = (event, val) => {
    let tempSelectVal = selectValue.tempState.slice();
    let index = selectValue.find((el) => el === val);
    if (index == -1) tempSelectVal.push(val);
    updateFieldData(tempSelectVal);
    setSelectValue({
      ...selectValue,
      tempState: tempSelectVal,
    });

    e.persist();
    setTimeout(() => {
      setFieldValue(name, tempSelectVal);
      setTimeout(() => onBlur(e), 10);
    });
  };
  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      let currValue =
        valuesList && valuesList.length > i ? valuesList[i] : options[i];
      list.push(
        <div>
          <Checkbox
            key={i}
            checked={getCurrentValueStatus(currValue)}
            onChange={(event) => checkboxValueChanged(event, currValue)}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      );
    }
  }
  if (
    currentValue.length != selectValue.originalState.length ||
    currentValue.filter((el) => !selectValue.originalState.includes(el))
      .length > 0
  )
    setSelectValue({
      originalState: currentValue,
      tempState: currentValue,
    });
  const inputUI = (
    <div className={[classes.margin].join(" ")}>
      {/* <InputLabel id="select-label">{label}</InputLabel> */}
      <Select
        labelId="select-label"
        id="select"
        className={styles.selectStyle}
        value={selectValue.tempState}
        readOnly={!props.editAllowed && !ignoreEditLocked}
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
