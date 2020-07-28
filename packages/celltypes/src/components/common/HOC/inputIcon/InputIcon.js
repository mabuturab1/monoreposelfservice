import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InputIcon.module.scss";
const InputIcon = ({ icon, handleClick, children, absolute }) => {
  return (
    <div className={styles.inputWrapper} onClick={handleClick}>
      {children}
      <FontAwesomeIcon
        icon={icon}
        className={absolute ? styles.absoluteIcon : styles.icon}
      />
    </div>
  );
};
export default InputIcon;
