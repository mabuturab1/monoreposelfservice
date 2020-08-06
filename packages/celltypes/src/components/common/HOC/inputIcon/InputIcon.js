import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InputIcon.module.scss";
import { InputAdornment, makeStyles } from "@material-ui/core";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "0.6rem",
  },
}));
const InputIcon = ({
  icon,
  handleClick,
  children,
  absolute,

  adormentStyles,
  readOnly,
  noClasses,
  startAdorment,
  endAdorment,
}) => {
  let classesToApply = [styles.inputWrapper];

  if (readOnly === false) classesToApply.push(styles.focus);
  else if (readOnly === true) classesToApply.push(styles.readOnly);
  if (noClasses === true) classesToApply = [];
  let adormentUI = null;
  const getAdorment = (adorm) => (
    <InputAdornment
      className={[
        absolute ? styles.absoluteIcon : styles.icon,
        styles.adorment,
      ].join(" ")}
    >
      {adorm}
    </InputAdornment>
  );
  return (
    <div className={classesToApply.join(" ")} onClick={handleClick}>
      {startAdorment ? getAdorment(startAdorment) : null}
      {children}
      {icon ? (
        <FontAwesomeIcon
          icon={icon}
          className={absolute ? styles.absoluteIcon : styles.icon}
        />
      ) : endAdorment ? (
        getAdorment(endAdorment)
      ) : null}
    </div>
  );
};
export default InputIcon;
