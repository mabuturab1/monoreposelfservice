import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InputIcon.module.scss";

const InputIcon = ({
  icon,
  handleClick,
  children,
  absolute,

  readOnly,
}) => {
  let classesToApply = [styles.inputWrapper];

  if (readOnly === false) classesToApply.push(styles.focus);
  else if (readOnly === true) classesToApply.push(styles.readOnly);

  return (
    <div className={classesToApply.join(" ")} onClick={handleClick}>
      {children}
      {icon ? (
        <FontAwesomeIcon
          icon={icon}
          className={absolute ? styles.absoluteIcon : styles.icon}
        />
      ) : null}
    </div>
  );
};
export default InputIcon;
