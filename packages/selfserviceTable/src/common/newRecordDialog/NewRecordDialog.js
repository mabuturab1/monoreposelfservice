import React, { useState } from "react";
import NewRecordData from "./NewRecordData";

import { Dialog, makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));

const NewRecordDialog = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id = open ? "simple-popover" : undefined;

  return (
    <React.Fragment>
      <div onClick={handleClick}>{props.children}</div>
      <Dialog
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <NewRecordData {...props} handleClose={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};
export default NewRecordDialog;
