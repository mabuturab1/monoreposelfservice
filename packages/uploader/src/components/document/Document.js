import React, { useState } from "react";
import styles from "./Document.module.scss";
import StyledInput from "../styledInput/StyledInput";
import { validateExtensions } from "../utility";
import InfoDialog from "../infoDialog/InfoDialog";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
const Document = ({ onSubmit }) => {
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    value: "",
    touched: false,
  });
  const handleFileSelection = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      if (!validateExtensions(event.currentTarget.files[0], [".pdf"])) {
        setShowError(true);
        return;
      }
      let udpatedSelectFile = {
        value: event.currentTarget.files[0],
        touched: true,
      };
      setSelectedFile(udpatedSelectFile);
      proceedForSubmission(udpatedSelectFile);
    }
  };
  const proceedForSubmission = (submitFile) => {
    if (submitFile.touched && onSubmit) {
      onSubmit(submitFile.value);
    }
  };
  const handleError = () => {
    console.log("ERROR IN IMAGE OCCURRED");
    if (selectedFile.touched) setShowError(false);
  };

  return (
    <div className={styles.wrapper}>
      {showError ? (
        <InfoDialog
          open={showError}
          icon={faExclamationCircle}
          handleClose={() => setShowError(false)}
          buttonTitle={"Okay"}
          content={"The file is not valid pdf file"}
          title={"Sorry"}
        />
      ) : null}

      <StyledInput
        headLabel={"Upload Documnet"}
        style={{ width: 0, height: 0, overflow: "hidden" }}
        type={"file"}
        accept="application/pdf"
        onChange={handleFileSelection}
        text={
          selectedFile.value === ""
            ? "Kindly select an image"
            : "Update selected file"
        }
      />
    </div>
  );
};
export default Document;
