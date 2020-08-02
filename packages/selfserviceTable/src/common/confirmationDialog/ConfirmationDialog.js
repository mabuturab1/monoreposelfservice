import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmationDialog = (props) => {
  const handleClose = () => {
    if (props.onDialogClosed) props.onDialogClosed();
  };
  const handleResult = (data) => {
    if (props.handleResponse) props.handleResponse(data);
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.summary}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleResult(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleResult(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default React.memo(ConfirmationDialog);
