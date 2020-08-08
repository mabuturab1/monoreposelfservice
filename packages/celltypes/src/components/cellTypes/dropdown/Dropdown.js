import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./Dropdown.module.scss";
import InputBase from "@material-ui/core/InputBase";
import * as Yup from "yup";
import Tooltip from "../../tooltip/Tooltip";
import { DropdownState } from "../../common/utility";
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
    setFieldError,
    validationSchema,
  } = {
    ...props,
  };
  console.log("Rendering dropdown");
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
  const [mError, setError] = useState(touched ? error : null);
  const [tabClosed, setTabClosed] = useState(DropdownState.untouched);
  const catchErrors = () => {
    if (!validationSchema) return;
    let schema = Yup.object().shape({
      [name]: validationSchema,
    });
    schema
      .validate({ [name]: selectValue.tempState })
      .then((val) => {
        if (mError) setError(null);
      })
      .catch(function (err) {
        console.log(err, err.message);
        if (!err || !err.message) return;
        console.log("setting error message");
        if (mError !== err.message) setError(err.message);
      });
  };
  if (touched && error && mError !== error) {
    setError(error);
  } else if (
    (!currentValue || currentValue === "") &&
    tabClosed === DropdownState.closed
  )
    catchErrors(selectValue.tempState);
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
        onOpen={() => setTabClosed(DropdownState.open)}
        onClose={() => setTabClosed(DropdownState.closed)}
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
