import React from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { makeStyles } from "@material-ui/core";
import styles from "./FilterHeader.module.scss";
const useStyles = makeStyles(() => ({
  root: {
    padding: "7px 11px",
  },
}));
const ToggleLogicButtons = (props) => {
  const classes = useStyles();
  const [logic, setLogic] = React.useState(props.initValue || "AND");
  const handleLogicUpdate = (event, newLogic) => {
    setLogic(newLogic);
    if (props.onChange) props.onChange(newLogic);
  };
  const isAndActive = logic === "AND";
  const isOrActive = logic === "OR";
  return (
    <ToggleButtonGroup
      value={logic}
      exclusive
      onChange={handleLogicUpdate}
      aria-label="text logic"
    >
      <ToggleButton
        value="AND"
        aria-label="AND"
        classes={{ root: classes.root }}
        className={styles.toggleButtonStyles}
        style={{
          backgroundColor: isAndActive ? "#1976d2" : "#e0e0e0",
          color: isAndActive ? "white" : "black",
        }}
      >
        AND
      </ToggleButton>
      <ToggleButton
        value="OR"
        aria-label="OR"
        classes={{ root: classes.root }}
        className={styles.toggleButtonStyles}
        style={{
          backgroundColor: isOrActive ? "#1976d2" : "#e0e0e0",
          color: isOrActive ? "white" : "black",
        }}
      >
        OR
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default ToggleLogicButtons;
