import React, { useState, useContext } from "react";
import styles from "./DocumentUpload.module.scss";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import Tooltip from "../../tooltip/Tooltip";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const DocumentUpload = (props) => {
  const {
    name,
    isDisabled: disabled,
    label,
    handleBlur: onBlur,
    placeholder,
    setFieldValue,
    error,
    touched,
    value,
    setFieldTouched,
  } = { ...props };
  const [selectedFile, setSelectedFile] = useState({
    filePath: value,
    tempFilePath: value,
    document: null,
    updated: true,
  });
  let src = value;

  if (selectedFile.document) src = URL.createObjectURL(selectedFile.document);

  const onLoad = (event) => {
    if (!selectedFile.updated) {
      setFieldValue(name, selectedFile.image);

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
  };
  if (selectedFile.filePath != value)
    setSelectedFile({
      ...selectedFile,
      filePath: value,
      tempFilePath: value,
    });
  const inputUI = (
    <div className={styles.wrapper}>
      <InputIcon icon={faFile}>
        <label className={styles.fileInput}>
          <input
            style={{ display: "none" }}
            type={props.editAllowed ? "file" : "text"}
            disabled={!props.editAllowed}
            value={selectedFile.tempFilePath}
            onBlur={(e) => {}}
            {...{ name, disabled, label, onBlur, placeholder }}
            onChange={(event) => {
              if (setFieldValue) {
                setSelectedFile({
                  ...selectedFile,
                  tempFilePath: URL.createObjectURL(
                    event.currentTarget.files[0]
                  ),
                  document: event.currentTarget.files[0],
                  updated: false,
                });
              }
            }}
            placeholder="Kindly select to upload a file"
            accept="/*"
          />
          Kindly select a file to upload
        </label>
      </InputIcon>
    </div>
  );
  return (
    <React.Fragment>
      <Tooltip
        arrow
        title={error || ""}
        open={(error && touched) === true}
        placement="bottom-start"
      >
        {inputUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default DocumentUpload;
