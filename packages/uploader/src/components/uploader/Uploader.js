import React, { useState } from "react";
import styles from "./Uploader.module.scss";
import InputBase from "@material-ui/core/InputBase";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button, Dialog } from "@material-ui/core";
import Image from "../image/Image";
import Video from "../video/Video";
import LinkInput from "../linkInput/LinkInput";
import Document from "../document/Document";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadFile } from "./uploadFunctions";
const BootstrapInput = withStyles((theme) => ({
  root: {
    minWidth: "5rem",
    width: "100%",

    fontFamily: "Open Sans",
    "label + &": {
      marginTop: theme.spacing(1),
    },
  },

  input: {
    borderRadius: 4,
    position: "relative",
    width: "100%",
    border: "1px solid rgba(0, 0, 50, 0.4)",
    color: "#4a4a4a",
    fontWeight: "500",
    fontSize: "0.8rem",

    MozBorderRadius: "0.6rem",
    WebkitBorderRadius: "0.6rem",
    padding: "3px 1.6rem 3px 0.75rem",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Roboto", "sans-serif"].join(","),
    "&:focus": {
      borderRadius: 4,
      background: "none",

      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    borderRadius: "0.6rem",
  },
  menuItem: {
    color: "#4a4a4a",
    fontWeight: "500",
    fontSize: "0.8rem",
    padding: "0.4rem 1.6rem",
    backgroundColor: "transparent",
    fontFamily: "'Roboto','sans-serif'",
  },
}));

const Uploader = (props) => {
  const { isSuccess } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const id = open ? "popover" : undefined;
  const [currentType, setCurrentType] = useState("Image");
  const handleChange = (event) => {
    setCurrentType(event.target.value);
  };
  const getUI = () => {
    switch (currentType) {
      case "Image":
        return <Image />;
      case "PDF":
        return <Document />;
      case "Video":
        return <Video />;
      case "Youtube":
        return <LinkInput />;
    }
  };
  const uploadFile = (data) => {
    uploadFile(data, currentType, isSuccess, submitData);
  };
  return (
    <React.Fragment>
      <div onClick={handleClick}>{props.children}</div>

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
        <div className={styles.uploaderWrapper}>
          <div className={styles.iconWrapper}>
            <div className={styles.editIcon}>
              <FontAwesomeIcon
                icon={faFileAlt}
                size="8x"
                style={{ paddingRight: "0.6rem", opacity: 0.4 }}
              />
            </div>
            <div className={styles.subtitleWrapper}>
              <FontAwesomeIcon
                icon={faFileAlt}
                size="1x"
                style={{ paddingRight: "1rem", color: "blue" }}
              />
              <p className={styles.subtitleText}>Click here to edit</p>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <div>
              <p className={styles.label}>Type</p>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={currentType}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <MenuItem value={"Image"}>Image</MenuItem>
                <MenuItem value={"PDF"}>PDF</MenuItem>
                <MenuItem value={"Video"}>Video</MenuItem>
                <MenuItem value={"Youtube"}>Youtube</MenuItem>
              </Select>
            </div>
            <div>{getUI()}</div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              style={{ fontSize: "0.9rem" }}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              style={{
                fontSize: "0.9rem",
                marginLeft: "1rem",
              }}
              color="primary"
              variant="contained"
            >
              Apply
            </Button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};
export default Uploader;
