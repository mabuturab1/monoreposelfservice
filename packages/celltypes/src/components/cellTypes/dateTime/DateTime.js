import React, { useState, useContext } from "react";
import styles from "./DateTime.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import TimePicker from "./timePicker/TimePicker";
import moment from "moment";
import { Popover, Button } from "@material-ui/core";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";
import Tooltip from "../../tooltip/Tooltip";

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
    error,
    touched,
    updateFieldData,
    pickers,
  } = {
    ...props,
  };
  let generalFormat = "YYYY-MM-DD HH:mm";
  let submitFormat = mSubmitFormat;
  let decodeFormat = mDecodeFormat;
  let showFormat = mShowFormat;
  let value = null;
  let isDateValid = false;
  let possibleFormats = [generalFormat];
  if (decodeFormat) possibleFormats.push(decodeFormat);
  if (submitFormat) possibleFormats.push(submitFormat);

  if (showFormat) possibleFormats.push(showFormat);
  let dateValid = moment(mValue, [decodeFormat, submitFormat, showFormat]);

  if (dateValid.isValid()) {
    value = mValue;
    isDateValid = true;
  }

  if (submitFormat)
    submitFormat = mSubmitFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  if (decodeFormat)
    decodeFormat = mDecodeFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  if (showFormat)
    showFormat = mShowFormat.replace("yyyy", "YYYY").replace("dd", "DD");
  const [dateValOriginal, setDateValOriginal] = useState(value);
  const [dateVal, setDateVal] = useState(
    (value && moment(value, decodeFormat || submitFormat)) ||
      moment(min || new Date(), decodeFormat || submitFormat)
  );
  const updateDefaultValue = () => {
    setDateVal(
      (value && moment(value, decodeFormat || submitFormat)) ||
        moment(min || new Date(), decodeFormat || submitFormat)
    );
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRangeError, setDateRangeError] = useState(false);

  const handleClick = (event) => {
    if (!props.editAllowed) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDataSubmit = (updatedTime = {}) => {
    let timeUpdateObtained = Object.keys(updatedTime).length > 0;

    let processedTimeFormat = getProcessedTime(
      dateVal,
      updatedTime,
      timeUpdateObtained
    );
    let processedTimeMoment = moment(processedTimeFormat);
    let processedTime = processedTimeMoment.format(
      submitFormat || decodeFormat || generalFormat
    );
    console.log("mValue is", mValue);
    console.log(
      moment(min, decodeFormat || submitFormat),
      processedTimeMoment,
      processedTimeMoment.isBefore(moment(min, decodeFormat || submitFormat))
    );
    console.log(
      moment(max, decodeFormat || submitFormat),
      processedTimeMoment,
      processedTimeMoment.isAfter(moment(max, decodeFormat || submitFormat))
    );
    if (
      timeUpdateObtained &&
      min &&
      processedTimeMoment.isBefore(moment(min, decodeFormat || submitFormat))
    ) {
      updateDefaultValue();
      setDateRangeError(true);
      return;
    }
    if (
      timeUpdateObtained &&
      max &&
      processedTimeMoment.isAfter(moment(max, decodeFormat || submitFormat))
    ) {
      updateDefaultValue();
      setDateRangeError(true);
      return;
    }
    if (dateRangeError) setDateRangeError(false);
    setAnchorEl(null);

    console.log("FINAL RESULT IS");
    console.log(value, processedTime);
    if (pickerOnlyIncludesDate()) timeUpdateObtained = true;
    if (updateFieldData && value !== processedTime && timeUpdateObtained) {
      updateFieldData(processedTime);
      setTimeout(() => setFieldValue(name, processedTime), 10);
    }

    setTimeout(() => setFieldTouched(name, true), 10);
  };
  let getTwoDigitsNumber = (val) => {
    return ("0" + val.toString()).trim().slice(-2);
  };

  let getProcessedTime = (selectedDates, updatedTime, isUpdateAvailable) => {
    if (!isUpdateAvailable) return selectedDates;
    let tempDate = moment(selectedDates);
    let clock = updatedTime.clock || "";
    let format =
      tempDate.format("yyyy-MM-DD") +
      "T" +
      getTwoDigitsNumber(
        moment(updatedTime.hours + " " + clock, "hh A").format("HH")
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

  const pickerHasDate = () => {
    return pickers && pickers.length > 0 && pickers.includes("DATE");
  };
  const pickerHasTime = () => {
    return pickers && pickers.length > 0 && pickers.includes("TIME");
  };
  const pickerOnlyIncludesDate = () => {
    return pickers && pickers.length === 1 && pickers.includes("DATE");
  };
  const pickerOnlyIncludesTime = () => {
    return pickers && pickers.length === 1 && pickers.includes("TIME");
  };
  const getWidth = () => {
    if (pickerOnlyIncludesTime()) return "17rem";
    if (pickerOnlyIncludesDate()) return "20rem";
    return "35rem";
  };
  return (
    <div className={styles.dateTimeWrapper}>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
        PopperProps={{
          disablePortal: true,
        }}
      >
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
      </Tooltip>

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
        <div className={styles.dateTimeModal} style={{ width: getWidth() }}>
          {pickerHasDate() ? (
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
              {pickerOnlyIncludesDate() ? (
                <div className={styles.calendarButtonWrapper}>
                  <Button
                    style={{ fontSize: "0.9rem" }}
                    color="secondary"
                    variant="contained"
                    onClick={() => setAnchorEl(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "1rem",
                    }}
                    color="primary"
                    variant="contained"
                    onClick={() => handleDataSubmit()}
                  >
                    Apply
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {pickerHasTime() ? (
            <div className={styles.timeInput}>
              <TimePicker
                hours={getLocalTime("hh")}
                mins={getLocalTime("mm")}
                clock={getLocalTime("clock")}
                rangeError={dateRangeError}
                onCancel={handleClose}
                min={min}
                max={max}
                onApply={(update) => {
                  updateInputValue(update);

                  setTimeout(() => handleDataSubmit(update));
                }}
              />
            </div>
          ) : null}
        </div>
      </Popover>
    </div>
  );
};
export default DateTime;
