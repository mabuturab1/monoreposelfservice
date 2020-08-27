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
      setSelectedFile({
        value: URL.createObjectURL(event.currentTarget.files[0]),
        touched: true,
      });
    }
  };
  const proceedForSubmission = () => {
    console.log("PROCEEDING FOR SUBMISSION");
    if (selectedFile.touched && onSubmit) {
      onSubmit(selectedFile.value);
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
      <img
        style={{ width: 0, height: 0, overflow: "hidden" }}
        src={selectedFile.value}
        onLoad={proceedForSubmission}
        onError={handleError}
      />
      <StyledInput
        headLabel={"Upload Documnet"}
        style={{ width: 0, height: 0, overflow: "hidden" }}
        value={selectedFile.value}
        type={"file"}
        onChange={handleFileSelection}
        text={"Kindly select PDF file"}
      />
    </div>
  );
};
export default Document;
