import React, { useState, useContext } from "react";
import styles from "./DocumentUpload.module.scss";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import Tooltip from "../../tooltip/Tooltip";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";

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
    updateFieldData,
  } = { ...props };
  const [selectedFile, setSelectedFile] = useState({
    filePath: value || DummyInitValues["DOCUMENT"],
    tempFilePath: value || DummyInitValues["DOCUMENT"],
    document: null,
    updated: true,
  });
  let src = value;

  if (selectedFile.document) src = URL.createObjectURL(selectedFile.document);

  const onLoad = (updatedValue) => {
    setFieldValue(name, updatedValue);

    const newFile = { ...selectedFile };
    setTimeout(() => setFieldTouched(name, true), 10);
    newFile.updated = true;
    setSelectedFile(newFile);
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
  if (value && selectedFile.filePath != value)
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
            onBlur={(e) => {}}
            {...{ name, disabled, label, onBlur, placeholder }}
            onChange={(event) => {
              if (
                !event.currentTarget.files ||
                event.currentTarget.files.length < 1
              )
                return;
              console.log(
                "on changed in doc upload",
                event,
                event.currentTarget.files[0]
              );
              let tempPath = URL.createObjectURL(event.currentTarget.files[0]);
              setSelectedFile({
                ...selectedFile,
                tempFilePath: tempPath,
                document: event.currentTarget.files[0],
                updated: false,
              });
              updateFieldData(tempPath, "FILE_UPDATE");
              setTimeout(() => onLoad(tempPath), 10);
            }}
            placeholder="Kindly select to upload a file"
            accept="/*"
          />
          {selectedFile.tempFilePath && selectedFile.tempFilePath != ""
            ? "Change Selected file"
            : " Kindly select a file to upload"}
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
        PopperProps={{
          disablePortal: true,
        }}
      >
        {inputUI}
      </Tooltip>
    </React.Fragment>
  );
};
export default DocumentUpload;
