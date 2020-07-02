import React, { useState } from "react";
import styles from "./TimePicker.module.scss";

const TimePicker = (props) => {
  const [errorState, setErrorState] = useState(false);
  const { hours, mins, clock, onApply, onCancel } = { ...props };
  const [timeVal, setTimeVal] = useState({
    hours: hours || "00",
    mins: mins || "00",
    clock: clock || "AM",
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
  return (
    <div className={styles.timePickerWrapper}>
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
          disabled={true}
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
