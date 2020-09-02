import React, { useState, useContext, useRef } from "react";
import styles from "./DocumentUpload.module.scss";
import InputIcon from "../../common/HOC/inputIcon/InputIcon";
import Tooltip from "../../tooltip/Tooltip";
import { faFile, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { DummyInitValues } from "../../common/constants/cellTypesDefaultValues";
import { validateExtensions } from "../../common/utility";
import InfoDialog from "../../common/infoDialog/InfoDialog";
import Uploader from "@selfservicetable/uploader/src/App";
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
    value: mValue,
    setFieldTouched,
    updateFieldData,
    getServerFileLinks,
    apiUrl,
    reportType,
  } = { ...props };
  let value = mValue;
  if (!value) value = {};
  const [selectedFile, setSelectedFile] = useState({
    filePath: value.f || DummyInitValues["LOUNGE_FILE"],
    tempFilePath: value.f || DummyInitValues["LOUNGE_FILE"],
    document: null,
    updated: true,
  });
  const [showError, setShowError] = useState(false);
  let src = value;
  let localFileName = useRef(null);
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
  // const getName = () => {
  //   if (localFileName.current) return String(localFileName.current);
  //   if (selectedFile.tempFilePath && selectedFile.tempFilePath != "")
  //     return String(selectedFile.tempFilePath);

  //   return "Change Selected file";
  // };
  const getHref = () => {
    return selectedFile.tempFilePath != null && selectedFile.tempFilePath != ""
      ? selectedFile.tempFilePath
      : undefined;
  };
  if (mValue && mValue.f && selectedFile.filePath != mValue.f) {
    setSelectedFile({
      ...selectedFile,
      filePath: mValue.f,
      tempFilePath: mValue.f,
    });
  }
  const getUploadLinks = (originalData, serverData) => {
    let tempPath = URL.createObjectURL(originalData);
    localFileName.current = originalData.name;
    setSelectedFile({
      ...selectedFile,
      tempFilePath: tempPath,
      document: originalData,
      updated: false,
    });
    if (serverData) updateFieldData(serverData);
    setTimeout(() => onLoad(tempPath), 10);
  };
  const inputUI = (
    <div className={styles.wrapper}>
      <InputIcon icon={faFile}>
        <label className={styles.fileInput}>
          {props.editAllowed ? (
            <React.Fragment>
              <Uploader
                apUrl={apiUrl}
                reportType={reportType}
                onFileUploadedToServer={getUploadLinks}
              >
                <input
                  style={{ display: "none", overflow: "hidden" }}
                  type={"text"}
                  disabled={!props.editAllowed}
                  onBlur={(e) => {}}
                  {...{ name, disabled, label, onBlur, placeholder }}
                  onChange={(event) => {
                    if (
                      !event.currentTarget.files ||
                      event.currentTarget.files.length < 1
                    )
                      return;

                    if (
                      !validateExtensions(event.currentTarget.files[0], [
                        ".pdf",
                      ])
                    ) {
                      setShowError(true);
                      return;
                    }
                  }}
                  placeholder="Kindly select to upload a file"
                />
                Kindly select to upload a file
              </Uploader>
            </React.Fragment>
          ) : (
            <a className={styles.nolink} href={getHref()}>
              {selectedFile.tempFilePath && selectedFile.tempFilePath != ""
                ? "Download selected file"
                : " Kindly select a file to upload"}
            </a>
          )}
        </label>
      </InputIcon>
    </div>
  );

  return (
    <React.Fragment>
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
