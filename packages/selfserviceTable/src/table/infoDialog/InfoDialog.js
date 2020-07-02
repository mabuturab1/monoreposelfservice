import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const InfoDialog = (props) => {
  const { open, handleClose, title, content, buttonTitle, icon } = { ...props };

  return (
    <div>
      <Dialog
        open={open || false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {icon && (
            <FontAwesomeIcon icon={icon} style={{ paddingRight: "10px" }} />
          )}
          {title || "Info"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content || "Thanks a lot"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {buttonTitle || "Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
InfoDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string,
  open: PropTypes.bool.isRequired,
  icon: PropTypes.any,
};
export default InfoDialog;
