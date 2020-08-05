import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./CheckboxList.module.scss";
import InputBase from "@material-ui/core/InputBase";

import Tooltip from "../../tooltip/Tooltip";
import { Checkbox, Popover } from "@material-ui/core";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkArrEqual } from "../../common/utility";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

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

const CheckboxList = (props) => {
  const {
    name,
    // label,
    value: mValue,
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
  let value = mValue;
  if (mValue == null || mValue === "") value = [];

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

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    if (!props.editAllowed) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      if (checkArrEqual(selectValue.tempState, selectValue.originalState)) {
        console.log(
          "arrrays are equal",
          selectValue.tempState,
          selectValue.originalState
        );
        return;
      }
      updateFieldData(selectValue.tempState);
      setTimeout(() => setFieldValue(name, selectValue.tempState), 10);
      setTimeout(() => setFieldTouched(name, true), 10);
    });
  };

  const getCurrentValueStatus = (val) => {
    return selectValue.tempState.includes(val);
  };

  const classes = useStyles();
  let list = [];
  const checkboxValueChanged = (e, val) => {
    let tempSelectVal = selectValue.tempState.slice();
    let index = selectValue.tempState.findIndex((el) => el === val);
    if (index == -1) tempSelectVal.push(val);
    else tempSelectVal.splice(index, 1);
    // updateFieldData(tempSelectVal);
    setSelectValue({
      ...selectValue,
      tempState: tempSelectVal,
    });

    e.persist();
    console.log("temp selected val", tempSelectVal);
  };
  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      let currValue =
        valuesList && valuesList.length > i ? valuesList[i] : options[i];
      list.push(
        <div key={i} className={styles.optionWrapper}>
          <p className={styles.text}>{options[i]}</p>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 17 }} />}
            checkedIcon={
              <CheckBoxIcon style={{ fontSize: 17, color: "#3F45D9" }} />
            }
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const inputUI = (
    <div className={[classes.margin].join(" ")}>
      {/* <InputLabel id="select-label">{label}</InputLabel> */}
      <div className={styles.inputWrapper}>
        <input
          className={[styles.input, styles.text].join(" ")}
          readOnly={true}
          onClick={handleClick}
          value={selectValue.tempState.join(", ")}
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
        <div className={styles.optionsWrapper}>{list}</div>
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
CheckboxList.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  valuesList: PropTypes.array,
};
export default CheckboxList;
