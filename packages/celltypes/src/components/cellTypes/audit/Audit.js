import React, { useState } from "react";

import { Button, makeStyles, Dialog } from "@material-ui/core";

import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import StyledInput from "../../common/styledInput/StyledInput";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { styles } from "@material-ui/pickers/views/Calendar/Calendar";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const Audit = ({ value: mValue, editAllowed }) => {
  const classes = useStyles();

  let value = mValue || {};
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    if (!editAllowed) return;
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
          <StyledInput value={"View Audit Info"} readOnly={true} />
        </InputIcon>
      </div>
      <Dialog
        maxWidth={"lg"}
        title={"Details"}
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open && editAllowed}
        onClose={handleClose}
      >
        <div style={{ width: "100px", height: "100px" }}>
          <p className={styles.text}>Coming Soon</p>
        </div>
      </Dialog>
    </div>
  );
};
export default Audit;
