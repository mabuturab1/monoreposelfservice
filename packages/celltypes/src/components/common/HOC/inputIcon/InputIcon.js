import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InputIcon.module.scss";
const InputIcon = ({ icon, handleClick, children }) => {
  return (
    <div className={styles.inputWrapper} onClick={handleClick}>
      {children}
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </div>
  );
};
export default InputIcon;
