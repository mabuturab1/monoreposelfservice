import React from "react";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./DateRangePicker.module.scss";
const RangePicker = (props) => {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});

  const toggle = () => setOpen(!open);
  const rangeChange = (range) => {
    console.log("new range is", range);

    setDateRange(range);
  };
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      if (props.onDateRangeChanged) props.onDateRangeChanged(dateRange);
    });
  };
  return (
    <React.Fragment>
      <div style={{ position: "relative" }}>
        <div onClick={toggle}>{props.children}</div>
        <div style={{ position: "absolute", top: "100%", left: 0 }}>
          <DateRangePicker open={open} toggle={toggle} onChange={rangeChange} />
          {open ? (
            <div
              onClick={() => handleClose()}
              className={styles.checkIcon}
              style={{}}
            >
              <FontAwesomeIcon icon={faCalendarCheck} size={"lg"} />
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};
export default RangePicker;
