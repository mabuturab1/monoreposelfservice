import React from "react";
import styles from "./StyledInput.module.scss";
const StyledInput = (props) => {
  let inputData = { ...props };
  delete inputData.headLabel;
  return (
    <div className={styles.wrapper}>
      {props.headLabel ? (
        <p className={styles.label}>{props.headLabel}</p>
      ) : null}
      <label
        className={styles.fileInput}
        style={{ cursor: props.type === "text" ? "unset" : "cursor" }}
      >
        <input
          className={styles.input}
          style={{ ...props.style }}
          {...inputData}
        />
        {props.text}
      </label>
    </div>
  );
};
export default StyledInput;
