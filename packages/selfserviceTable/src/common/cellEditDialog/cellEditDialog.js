import React from "react";

import { Popover, makeStyles } from "@material-ui/core";
import CellEditDialogData from "./cellEditDialogData";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const CellEditDialog = React.forwardRef((props, ref) => {
  const classes = useStyles();

  const handleClick = (event) => {};

  const handleClose = () => {
    if (props.onDialogClosed) props.onDialogClosed();
  };
  const open = props.openAllowed;
  const id = open ? "simple-popover" : undefined;

  return (
    <Popover
      id={id}
      classes={{
        paper: classes.paper,
      }}
      open={open}
      anchorEl={ref.current}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <CellEditDialogData
        {...props}
        handleClick={handleClick}
        handleClose={handleClose}
      />
    </Popover>
  );
});
export default CellEditDialog;
