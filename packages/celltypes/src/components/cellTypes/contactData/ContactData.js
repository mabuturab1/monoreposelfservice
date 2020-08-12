import React, { useState } from "react";

import { Button, makeStyles, Dialog } from "@material-ui/core";
import ContactDataDialog from "./contactDataDialog/ContactDataDialog";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import StyledInput from "../../common/styledInput/StyledInput";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "0.6rem",
  },
}));
const ContactData = ({ value: mValue, editAllowed }) => {
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
      <div onClick={handleClick}>
        <InputIcon icon={faAddressBook}>
          <StyledInput value={"View Contact Info"} readOnly={true} />
        </InputIcon>
      </div>
      <Dialog
        maxWidth={"lg"}
        title={"Details"}
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <ContactDataDialog {...value} onClose={handleClose} />
      </Dialog>
    </div>
  );
};
export default ContactData;
