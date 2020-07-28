import React from "react";
import styles from "./ReadOnlyText.module.scss";
export const readOnlyText = (props) => {
  return (
    <div className={styles.text} style={{ ...props.style }}>
      <span>{props.value}</span>
    </div>
  );
};
export default readOnlyText;
