import React, { useState, useContext } from "react";
import styles from "./DateTime.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import TimePicker from "./timePicker/TimePicker";
import moment from "moment";
import { Popover } from "@material-ui/core";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";

const DateTime = (props) => {
  const {
    name,

    showFormat: mShowFormat,
    submitFormat: mSubmitFormat,
    setFieldValue,
    setFieldTouched,
    decodeFormat: mDecodeFormat,
    min,
    max,
    value: mValue,

    updateFieldData,
  } = {
    ...props,
  };
  let submitFormat = mSubmitFormat;
  let decodeFormat = mDecodeFormat;
  let showFormat = mShowFormat;
  let value = null;
  let dateValid = moment(mValue || DummyInitValues["DATETIME"]);
  if (dateValid.isValid()) value = mValue;
  if (submitFormat)
    submitFormat = mSubmitFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  if (decodeFormat)
    decodeFormat = mDecodeFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  if (showFormat)
    showFormat = mShowFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  const [dateValOriginal, setDateValOriginal] = useState(value);
  const [dateVal, setDateVal] = useState(
    (value && moment(value, decodeFormat || submitFormat)) ||
      moment(new Date(), decodeFormat || submitFormat)
  );

  const [anchorEl, setAnchorEl] = useState(null);
  let generalFormat = "YYYY-MM-DD HH:mm";
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleDataSubmit();
  };
  const handleDataSubmit = (updatedTime = {}) => {
    let isUpdateAvailable = Object.keys(updatedTime).length > 0;
    let processedTimeFormat = getProcessedTime(
      dateVal,
      updatedTime,
      isUpdateAvailable
    );
    let processedTime = moment(processedTimeFormat).format(
      submitFormat || decodeFormat || generalFormat
    );
    if (updateFieldData && value !== processedTime) {
      updateFieldData(processedTime);
      setTimeout(() => setFieldValue(name, processedTime));
    }

    setTimeout(() => setFieldTouched(name, true), 10);
  };
  let getTwoDigitsNumber = (val) => {
    return ("0" + val.toString()).trim().slice(-2);
  };
  let getProcessedTime = (selectedDates, updatedTime, isUpdateAvailable) => {
    if (!isUpdateAvailable) return selectedDates;
    let tempDate = moment(selectedDates);
    let format =
      tempDate.format("yyyy-MM-DD") +
      "T" +
      getTwoDigitsNumber(
        +updatedTime.hours +
          ((updatedTime.clock || "").trim() === "PM" ? 12 : 0) || "00"
      ) +
      ":" +
      getTwoDigitsNumber(updatedTime.mins || "00").trim() +
      ":00";

    return format;
  };
  const open = Boolean(anchorEl) && props.editAllowed;
  const id = open ? "simple-popover" : undefined;

  let getLocalTime = (val) => {
    if (val === "hh")
      return dateVal.format("hh A").replace("PM", "").replace("AM", "");
    if (val === "mm")
      return dateVal.format("mm A").replace("PM", "").replace("AM", "");
    if (val === "clock")
      return dateVal.format("hh A").includes("AM") ? "AM" : "PM";
  };
  let updateInputValue = (updatedTime = {}) => {
    let isUpdateAvailable = Object.keys(updatedTime).length > 0;
    let processedTimeFormat = getProcessedTime(
      dateVal,
      updatedTime,
      isUpdateAvailable
    );
    setDateVal(moment(processedTimeFormat));
  };
  if (value && value !== dateValOriginal) {
    setDateValOriginal(value);
    setDateVal(moment(value, decodeFormat || submitFormat));
  }
  return (
    <div className={styles.dateTimeWrapper}>
      <div className={styles.inputWrapper}>
        <input
          autoComplete="off"
          className={styles.input}
          readOnly
          value={dateVal.format(
            showFormat || submitFormat || decodeFormat || "YYYY-MM-DDTHH:mm"
          )}
        />
        <div onClick={handleClick}>
          <FontAwesomeIcon
            style={{ color: "#31b0d5", cursor: "pointer" }}
            icon={faCalendarDay}
          />
        </div>
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
        <div className={styles.dateTimeModal}>
          <div className={styles.datePicker}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Calendar
                style={{ width: "20rem" }}
                date={dateVal}
                minDate={min ? moment(min) : undefined}
                maxDate={max ? moment(max) : undefined}
                onChange={(newDate) => {
                  setDateVal(newDate);
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className={styles.timeInput}>
            <TimePicker
              hours={getLocalTime("hh")}
              mins={getLocalTime("mm")}
              clock={getLocalTime("clock")}
              onCancel={handleClose}
              onApply={(update) => {
                setAnchorEl(null);
                updateInputValue(update);

                setTimeout(() => handleDataSubmit(update));
              }}
            />
          </div>
        </div>
      </Popover>
    </div>
  );
};
export default DateTime;
