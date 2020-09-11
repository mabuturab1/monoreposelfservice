import React, { useState, useRef } from "react";
import styles from "./Uploader.module.scss";
import InputBase from "@material-ui/core/InputBase";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button, Dialog, CircularProgress } from "@material-ui/core";
import Image from "../image/Image";
import Video from "../video/Video";
import LinkInput from "../linkInput/LinkInput";
import Document from "../document/Document";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadFile } from "./uploadFunctions";
import PdfImage from "../../../public/pdfImage.png";
import YoutubeImage from "../../../public/youtube.png";
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
    border: "1px solid #707070",
    color: "#222222",
    fontWeight: "500",
    fontSize: "0.9rem",
    backgroundColor: "#fff",
    MozBorderRadius: "0.6rem",
    WebkitBorderRadius: "0.6rem",
    padding: "8px 1.6rem 8px 0.75rem",
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
  listStyles: {
    backgroundColor: "#EEECEC",
  },
  buttonRoot: {
    fontSize: "0.9rem",
    padding: "0 10px",
    padding: "3px 10px",
    width: "44%",
    fontWeight: 400,
  },
  containedPrimary: { backgroundColor: "#4E88F5" },
  containedSecondary: { backgroundColor: "#D9D9D9" },
  menuItem: {
    color: "#222222",
    fontWeight: "500",
    fontSize: "0.8rem",
    padding: "0.4rem 1.6rem",
    backgroundColor: "transparent",
    fontFamily: "'Roboto','sans-serif'",
  },
}));

const Uploader = (props) => {
  const { onFileUploadedToServer, apiUrl, reportType, bearerToken } = props;
  const classes = useStyles();
  const fileName = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const id = open ? "popover" : undefined;
  const [currentType, setCurrentType] = useState("Image");
  const handleChange = (event) => {
    setCurrentValue(null);
    setCurrentType(event.target.value);
  };
  const handleDataSubmit = (data, name) => {
    if (name) fileName.current = name;
    setCurrentValue(data);
  };
  const getUI = () => {
    switch (currentType) {
      case "Image":
        return <Image onSubmit={handleDataSubmit} />;
      case "PDF":
        return <Document onSubmit={handleDataSubmit} />;
      case "Video":
        return <Video onSubmit={handleDataSubmit} />;
      case "Youtube":
        return <LinkInput onSubmit={handleDataSubmit} />;
    }
  };
  const getCurrentDisplayElement = () => {
    switch (currentType) {
      case "Image":
        return <img src={currentValue} className={styles.singleItemWrapper} />;
      case "PDF":
        return (
          <React.Fragment>
            <img src={PdfImage} className={styles.singleItemWrapper} />
            <p>{fileName.current}</p>
          </React.Fragment>
        );
      case "Video":
        return (
          <video
            controls
            src={currentValue}
            className={styles.singleItemWrapper}
          />
        );
      case "Youtube":
        return (
          <React.Fragment>
            <img src={YoutubeImage} className={styles.singleItemWrapper} />
            <a href="#">{fileName.current}</a>
          </React.Fragment>
        );
    }
  };
  const startUploadingFile = () => {
    if (currentType == "Youtube" && currentValue) {
      onFileUploadedToServer(currentValue, currentValue, {
        t: currentValue,
        f: currentValue,
      });
      return;
    }
    setIsUploading(true);

    uploadFile(
      apiUrl,
      reportType,
      currentValue,
      currentType,
      bearerToken,
      (status, response) => {
        setIsUploading(false);
        if (status && response && onFileUploadedToServer) {
          onFileUploadedToServer(currentValue, fileName.current, response);
          handleClose();
        }
      }
    );
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
          {currentValue != null ? (
            <div className={styles.displayElementWrapper}>
              {getCurrentDisplayElement()}
            </div>
          ) : (
            <label style={{ cursor: "pointer" }}>
              <div style={{ width: "0px", height: "0px", display: "none" }}>
                {getUI()}
              </div>
              <div className={styles.iconWrapper}>
                <div className={styles.editIcon}>
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    size="8x"
                    style={{ paddingRight: "0.6rem", color: "#BFBFBF" }}
                  />
                </div>
                <div className={styles.subtitleWrapper}>
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    size="1x"
                    style={{ paddingRight: "1rem", color: "#4E88F5" }}
                  />
                  <p className={styles.subtitleText}>Click here to edit</p>
                </div>
              </div>
            </label>
          )}
          <div className={styles.inputWrapper}>
            <div className={styles.fileSelection}>
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
            <div className={styles.fileSelection}> {getUI()}</div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              classes={{
                root: classes.buttonRoot,
                containedSecondary: classes.containedSecondary,
              }}
              color="secondary"
              variant="contained"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              classes={{
                root: classes.buttonRoot,
                containedPrimary: classes.containedPrimary,
              }}
              color="primary"
              variant="contained"
              onClick={startUploadingFile}
            >
              {isUploading ? (
                <div style={{ color: "white" }}>
                  <CircularProgress size={20} color="inherit" />
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};
export default Uploader;
