import React, { useState } from "react";
import styles from "./Video.module.scss";
import StyledInput from "../styledInput/StyledInput";
const myVideo = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState({
    value: "",
    touched: false,
  });
  const handleFileSelection = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
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
  };
  return (
    <div className={styles.wrapper}>
      <video
        style={{ width: 0, height: 0, overflow: "hidden" }}
        src={selectedFile.value}
        onLoad={proceedForSubmission}
        onError={handleError}
      />

      <StyledInput
        headLabel={"Video Link"}
        style={{ width: 0, height: 0, overflow: "hidden" }}
        value={selectedFile.value}
        type={"file"}
        onChange={handleFileSelection}
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
