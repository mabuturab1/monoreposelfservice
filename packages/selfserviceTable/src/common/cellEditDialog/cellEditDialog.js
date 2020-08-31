import React from "react";

import { Popover, makeStyles, CircularProgress } from "@material-ui/core";
import CellEditDialogData from "./cellEditDialogData";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "0.6rem",
  },
}));
const CellEditDialog = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const showSpinner = props.showSpinner || false;
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
      {showSpinner ? (
        <CircularProgress />
      ) : (
        <CellEditDialogData
          {...props}
          handleClick={handleClick}
          handleClose={handleClose}
        />
      )}
    </Popover>
  );
});
export default CellEditDialog;
