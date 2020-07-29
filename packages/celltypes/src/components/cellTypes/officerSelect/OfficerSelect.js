import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./OfficerSelect.module.scss";
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
    valuesList && valuesList.includes(mValue.i) ? mValue.i : "";
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
  if (currentValue !== selectValue.originalState)
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
          console.log(selectValue.originalState, e.target.value);

          setTimeout(() => setFieldValue(name, e.target.value));
          setTimeout(() => setFieldTouched(name, true), 10);
          if (selectValue.originalState === e.target.value) return;
          if (updateFieldData) updateFieldData(e.target.value);
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
OfficerSelect.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
};
export default OfficerSelect;
