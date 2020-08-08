import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import styles from "./RadioList.module.scss";
import InputBase from "@material-ui/core/InputBase";

import Tooltip from "../../tooltip/Tooltip";
import { Popover, Radio } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
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

const RadioList = (props) => {
  const {
    name,
    // label,
    value,
    error,
    touched,
    ignoreEditLocked,
    handleChange,
    options,
    valuesList,
    setFieldValue,
    setFieldTouched,
    updateFieldData,
    editAllowed,
  } = {
    ...props,
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (!editAllowed) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);

    setTimeout(() => {
      setFieldValue(name, selectValue.tempState);
      setTimeout(() => setFieldTouched(name, true), 10);
    });
    if (selectValue.originalState === selectValue.tempState) return;
    updateFieldData(selectValue.tempState);
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
      let localValue =
        valuesList && valuesList.length > i ? valuesList[i] : options[i];
      list.push(
        <div key={i} className={styles.optionWrapper}>
          <p className={styles.text}>{options[i]}</p>
          <Radio
            key={i}
            icon={
              <RadioButtonUncheckedIcon
                style={{ fontSize: 17, color: "#3F45D9" }}
              />
            }
            checkedIcon={
              <RadioButtonCheckedIcon
                style={{ fontSize: 17, color: "#3F45D9" }}
              />
            }
            checked={selectValue.tempState === localValue}
            onChange={(e) =>
              setSelectValue({ ...selectValue, tempState: e.target.value })
            }
            value={localValue}
            name={name}
            inputProps={{ "aria-label": "A" }}
          />
        </div>
      );
    }
  }
  if (value && currentValue !== selectValue.originalState)
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
RadioList.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
};
export default RadioList;
