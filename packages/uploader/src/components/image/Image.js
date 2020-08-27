import React, { useState } from "react";
import styles from "./Image.module.scss";
import StyledInput from "../styledInput/StyledInput";
import InfoDialog from "../infoDialog/InfoDialog";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
const image = ({ onSubmit }) => {
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    value: "",
    touched: false,
  });
  const handleFileSelection = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      console.log(
        "FILE URL IS",
        URL.createObjectURL(event.currentTarget.files[0])
      );
      setSelectedFile({
        value: URL.createObjectURL(event.currentTarget.files[0]),
        touched: true,
      });
    }
  };
  console.log("SET SELECT FILE", selectedFile);
  const proceedForSubmission = () => {
    if (selectedFile.touched && onSubmit) {
      onSubmit(selectedFile.value);
    }
  };
  const handleError = () => {
    if (selectedFile.touched) setShowError(true);
  };
  return (
    <div className={styles.wrapper}>
      <img
        style={{
          width: 0,
          height: 0,
          overflow: "hidden",
          position: "absolute",
        }}
        src={selectedFile.value}
        onLoad={proceedForSubmission}
        onError={handleError}
      />
      {showError ? (
        <InfoDialog
          open={showError}
          icon={faExclamationCircle}
          handleClose={() => setShowError(false)}
          buttonTitle={"Okay"}
          content={"The file is not valid image file"}
          title={"Sorry"}
        />
      ) : null}
      <StyledInput
        headLabel={"Upload Image"}
        style={{ display: "none", overflow: "hidden" }}
        type={"file"}
        onChange={handleFileSelection}
        text={
          selectedFile.value === ""
            ? "Kindly select an image"
            : "Update selected file"
        }
        accept="image/*"
      />
    </div>
  );
};
export default image;
