import React, { useState } from "react";

import { Button, makeStyles, Dialog } from "@material-ui/core";
import ContactDataDialog from "./contactDataDialog/ContactDataDialog";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const ContactData = ({ value: mValue }) => {
  const classes = useStyles();
  let value = mValue || {};
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const id = open ? "popover" : undefined;
  return (
    <div>
      <Button onClick={handleClick} color="primary">
        View Contact Details
      </Button>
      <Dialog
        title={"Details"}
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <ContactDataDialog {...value} />
      </Dialog>
    </div>
  );
};
export default ContactData;
