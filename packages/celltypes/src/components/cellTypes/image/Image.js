import React, { useState, useContext } from "react";
import styles from "./Image.module.scss";
import BlankImage from "../../../assets/images/blankImage.png";
import Tooltip from "../../tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Image = (props) => {
  const {
    name,
    isDisabled: disabled,
    label,
    handleBlur: onBlur,

    placeholder,
    setFieldValue,
    error,
    touched,
    value: mValue,
    setFieldTouched,
    updateFieldData,
  } = { ...props };
  let value = (mValue || {}).f;

  const [selectedFile, setSelectedFile] = useState({
    image: value,
    updated: true,
  });

  let src = value;
  if (!selectedFile.image) src = BlankImage;
  if (selectedFile.image) src = selectedFile.image;
  const onLoad = (event) => {
    if (!selectedFile.updated) {
      if (updateFieldData) updateFieldData(selectedFile.image, "IMAGE_UPDATE");

      setTimeout(() => setFieldValue(name, selectedFile.image), 10);

      const newFile = { ...selectedFile };
      setTimeout(() => setFieldTouched(name, true), 10);
      newFile.updated = true;
      setSelectedFile(newFile);
    }
  };
  const onError = (event) => {
    if (!selectedFile.updated) {
      const newFile = { ...selectedFile };
      newFile.image = null;
      newFile.updated = true;
      setSelectedFile(newFile);
      setFieldValue(name, null);
    }
    alert("Sorry" + "Uploaded image is not invalid");
  };

  const inputUI = (
    <div className={styles.wrapper}>
      <img
        src={src}
        onError={onError}
        onLoad={onLoad}
        className={styles.imageStyle}
        alt="user"
      />

      <label className={styles.fileInput}>
        <input
          style={{ display: "none" }}
          type={props.editAllowed ? "file" : "text"}
          disabled={!props.editAllowed}
          onBlur={(e) => {}}
          {...{ name, disabled, label, onBlur, placeholder }}
          onChange={(event) => {
            if (setFieldValue) {
              setSelectedFile({
                image: URL.createObjectURL(event.currentTarget.files[0]),
                updated: false,
              });
            }
          }}
          placeholder="Kindly select to upload a file"
          accept="image/*"
        />
        <FontAwesomeIcon
          icon={faEdit}
          size={"lg"}
          style={{ color: "#4E88F5" }}
        />
        <span
          style={{
            marginLeft: "3px",
            color: "#",
            display: "inline-block",
            fontFamily: "inherit",
          }}
        >
          Click here to edit
        </span>
      </label>
    </div>
  );
  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
        PopperProps={{
          disablePortal: true,
        }}
      >
        {inputUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default Image;
