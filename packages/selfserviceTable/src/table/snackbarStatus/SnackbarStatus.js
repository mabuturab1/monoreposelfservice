import React, { useState } from "react";
import { connect } from "react-redux";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SnackbarStatus = (props) => {
  const { updateStatus } = { ...props };
  const [snackbarData, setSnackbarData] = useState({
    isUpdating: false,
    cellKey: "",
    error: false,
    updated: false,
    content: null,
  });
  const updatingMessage = "Kindly wait while data is updating";
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState(updatingMessage);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleClose = (e, reason) => {
    if (reason && reason === "clickaway") return;

    setShowSnackbar(false);
    setTimeout(() => {
      setSeverity((severity) => (severity !== "info" ? "info" : severity));
      setMessage((message) =>
        message !== updatingMessage ? updatingMessage : message
      );
    }, 100);
  };
  const isNewData = () => {
    return (
      Object.keys(updateStatus).filter(
        (el) => updateStatus[el] !== snackbarData[el]
      ).length > 0
    );
  };
  if (isNewData()) {
    let severityVal = updateStatus.isUpdating
      ? "info"
      : updateStatus.error
      ? "error"
      : "success";
    let data = updateStatus.isUpdating
      ? snackbarData.content || updatingMessage
      : updateStatus.updated
      ? `${updateStatus.cellKey} updated successfully`
      : `An error occurred while updating ${updateStatus.cellKey}`;

    if (!showSnackbar) setShowSnackbar(true);
    setMessage((message) => (message !== data ? data : message));
    setSeverity((severity) =>
      severity !== severityVal ? severityVal : severity
    );
    setSnackbarData(updateStatus);
  }
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={showSnackbar}
      onClose={handleClose}
      key={"topBottom"}
      autoHideDuration={updateStatus.isUpdating ? undefined : 3000}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
const mapStateToProps = (state) => {
  return {
    updateStatus: state.snackbarStatus,
  };
};

const areEqualSnackbars = (prevProps, nextProps) => {
  if (!prevProps.updateStatus || !nextProps.updateStatus) return false;

  return (
    Object.keys(prevProps.updateStatus).filter(
      (el) => prevProps.updateStatus[el] !== nextProps.updateStatus[el]
    ).length < 1
  );
};
export default connect(mapStateToProps)(
  React.memo(SnackbarStatus, areEqualSnackbars)
);
