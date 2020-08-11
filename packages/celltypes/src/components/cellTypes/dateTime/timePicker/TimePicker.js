import React, { useState } from "react";
import styles from "./TimePicker.module.scss";
import * as moment from "moment";
const TimePicker = (props) => {
  const [errorState, setErrorState] = useState(false);
  const { hours, mins, clock, onApply, onCancel } = { ...props };
  let getLocalTime = (dateVal, val) => {
    if (val === "hh")
      return dateVal.format("hh A").replace("PM", "").replace("AM", "");
    if (val === "mm")
      return dateVal.format("mm A").replace("PM", "").replace("AM", "");
    if (val === "clock")
      return dateVal.format("hh A").includes("AM") ? "AM" : "PM";
  };
  let minTime = moment(props.min);
  let minHour = null;
  let minMins = null;
  let clockTime = null;
  if (minTime && minTime.isValid()) {
    minHour = getLocalTime(minTime, "hh");
    minMins = getLocalTime(minTime, "mm");
    minMins = getLocalTime(minTime, "clock");
  }
  if (minHour) minHour;
  const [timeVal, setTimeVal] = useState({
    hours: hours || minHour || "00",
    mins: mins || minMins || "00",
    clock: clock || clockTime || "AM",
  });

  const onTimeChange = (e, min, max) => {
    if (!e.currentTarget.value) {
      return "";
    }
    if (isNaN(e.currentTarget.value) && e.currentTarget.value.length > 0) {
      return 0;
    }
    if (parseInt(e.currentTarget.value) < min) return min;
    else if (parseInt(e.currentTarget.value) > max) return max;
    else return Math.floor(e.currentTarget.value);
  };
  const toggleClock = () => {
    if (timeVal.clock === "AM") return "PM";
    else return "AM";
  };
  let dateRangeClasses = [styles.timeLabel, styles.smallMargin];
  if (props.rangeError) dateRangeClasses.push(styles.redColor);
  return (
    <div className={styles.timePickerWrapper}>
      {props.min && props.max ? (
        <div className={styles.dateRangeLabels}>
          <div>
            <p
              className={[styles.timeLabel, styles.removeBottomMargin].join(
                " "
              )}
            >
              Date Range
            </p>
          </div>
          <div className={styles.rangeValueWrapper}>
            <p className={dateRangeClasses.join(" ")}>{props.min}</p>
            <p
              className={dateRangeClasses.join(" ")}
              style={{ textDecoration: "none" }}
            >
              -
            </p>
            <p className={dateRangeClasses.join(" ")}>{props.max}</p>
          </div>
        </div>
      ) : null}
      <div className={styles.timeLabelWrapper}>
        <p className={styles.timeLabel}> Set Time</p>
      </div>
      <div style={{ position: "relative" }}>
        <div className={styles.timeInput}>
          <input
            className={styles.timePicker}
            type="text"
            value={timeVal.hours}
            onChange={(e) => {
              setTimeVal({ ...timeVal, hours: onTimeChange(e, 0, 12) });
            }}
          />
          <span>:</span>
          <input
            className={styles.timePicker}
            type="text"
            value={timeVal.mins}
            onChange={(e) => {
              setTimeVal({ ...timeVal, mins: onTimeChange(e, 0, 59) });
            }}
          />
          <span></span>
          <input
            className={[
              styles.timePicker,
              styles.applyCursor,
              styles.textUnselect,
            ].join(" ")}
            type="text"
            value={timeVal.clock}
            readOnly={true}
            onClick={(e) => {
              setTimeVal({ ...timeVal, clock: toggleClock() });
            }}
          />
        </div>
        {errorState ? (
          <span className={styles.errorText}>
            Valid hours are 1-12 and valid mins are 0-59
          </span>
        ) : null}
      </div>
      <div className={styles.buttonWrapper}>
        <button
          onClick={() => {
            if (onCancel) onCancel();
          }}
          className={styles.button}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (parseInt(timeVal.hours) < 1 || parseInt(timeVal.hours) > 12) {
              setErrorState(true);
              return;
            }
            if (onApply) onApply(timeVal);
          }}
          className={styles.button}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
