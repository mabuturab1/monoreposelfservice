import React, { useState } from "react";
import styles from "./Video.module.scss";
import StyledInput from "../styledInput/StyledInput";
import InfoDialog from "../infoDialog/InfoDialog";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { validateExtensions } from "../utility";
const myVideo = ({ onSubmit }) => {
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    value: "",
    touched: false,
    fileName: "",
  });
  const handleFileSelection = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      if (
        !validateExtensions(event.currentTarget.files[0], [
          "m4v",
          "avi",
          "mpg",
          "mp4",
          "webm",
        ])
      ) {
        setShowError(true);
        return;
      }
      let file = event.currentTarget.files[0];
      let updatedObj = {
        value: URL.createObjectURL(file),
        touched: true,
        fileName: file.name,
      };
      console.log("CURRENT TARGET", updatedObj);
      setSelectedFile(updatedObj);
      proceedForSubmission(updatedObj);
    }
  };
  const proceedForSubmission = (updatedObj) => {
    if (updatedObj.touched && onSubmit) {
      onSubmit(updatedObj.value, updatedObj.fileName);
    }
  };

  return (
    <div className={styles.wrapper}>
      {showError ? (
        <InfoDialog
          open={showError}
          icon={faExclamationCircle}
          handleClose={() => setShowError(false)}
          buttonTitle={"Okay"}
          content={"Video format not supported"}
          title={"Sorry"}
        />
      ) : null}
      <video
        style={{
          width: 0,
          height: 0,
          overflow: "hidden",
          position: "absolute",
        }}
        controls
        src={selectedFile.value}
      />

      <StyledInput
        headLabel={"Video Link"}
        style={{ width: 0, height: 0, overflow: "hidden" }}
        type={"file"}
        onChange={handleFileSelection}
        accept="video/*"
        text={
          selectedFile.value === ""
            ? "Kindly select a file"
            : "Update selected file"
        }
      />
    </div>
  );
};
export default myVideo;
