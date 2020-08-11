import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LightBox.module.scss";
const LightBox = (props) => {
  const { open, handleClose, title, src, buttonTitle, icon } = { ...props };

  return (
    <div>
      <Dialog
        maxWidth={"lg"}
        open={open || false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "#2f84be" }}>
          {icon && (
            <FontAwesomeIcon icon={icon} style={{ paddingRight: "0.6rem" }} />
          )}
          {title || "Info"}
        </DialogTitle>

        <img className={styles.imageStyle} src={src} />
        <a
          style={{
            fontSize: "12px",
            fontFamily: "inherit",
            margin: "0 auto",
            marginTop: "1rem",
          }}
          href={src}
          target="_blank"
        >
          {src}
        </a>

        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {buttonTitle || "Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
LightBox.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string,
  open: PropTypes.bool.isRequired,
  icon: PropTypes.any,
};
export default LightBox;
