import React from "react";
import styles from "./StyledInput.module.scss";
const StyledInput = (props) => {
  return (
    <input className={styles.input} style={{ ...props.style }} {...props} />
  );
};
export default StyledInput;
