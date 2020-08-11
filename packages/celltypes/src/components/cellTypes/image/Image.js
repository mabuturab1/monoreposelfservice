import React, { useState, useContext } from "react";
import styles from "./Image.module.scss";
import BlankImage from "../../../assets/images/blankImage.png";
import Tooltip from "../../tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faExclamationCircle,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import InfoDialog from "../../common/infoDialog/InfoDialog";
import LightBox from "../../common/lightBox/LightBox";

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
  let value = mValue;
  if (!value) value = {};
  let src = value.t;
  if (!src) src = BlankImage;
  const [selectedFile, setSelectedFile] = useState({
    image: src,
    tempImage: src,
    updated: true,
  });
  const [showError, setShowError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const onLoad = (event) => {
    if (!selectedFile.updated) {
      if (updateFieldData)
        updateFieldData(selectedFile.tempImage, "IMAGE_UPDATE");

      setTimeout(() => setFieldValue(name, selectedFile.tempImage), 10);

      const newFile = { ...selectedFile };
      setTimeout(() => setFieldTouched(name, true), 10);
      newFile.updated = true;
      setSelectedFile(newFile);
    }
  };
  const onError = (event) => {
    if (!selectedFile.updated) {
      const newFile = { ...selectedFile, image: src, tempImage: src };
      newFile.updated = true;
      setShowError(true);
      setSelectedFile(newFile);

      // setTimeout(() => {
      //   setFieldValue(name, null);
      //   setFieldTouched(name, true);
      // });
    }
  };
  if (touched)
    console.log(
      mValue && mValue.t && selectedFile.image != mValue.t,
      mValue,
      selectedFile
    );
  if (mValue && mValue.t && selectedFile.image != mValue.t) {
    setSelectedFile({
      ...selectedFile,
      image: mValue.t,
      tempImage: mValue.t,
      updated: true,
    });
  }
  const imageClicked = () => {
    if (!mValue || !mValue.f) return;
    console.log("image clicked");
    setShowImage(true);
  };

  const inputUI = (
    <div className={styles.wrapper}>
      <div onClick={imageClicked} className={styles.imageWrapper}>
        <img
          src={selectedFile.tempImage || BlankImage}
          onError={onError}
          onLoad={onLoad}
          className={styles.imageStyle}
          alt="user"
        />
      </div>
      <label className={styles.fileInput}>
        <input
          style={{ display: "none" }}
          type={props.editAllowed ? "file" : "text"}
          disabled={!props.editAllowed}
          onBlur={(e) => {}}
          {...{ name, disabled, label, onBlur, placeholder }}
          onChange={(event) => {
            if (
              setFieldValue &&
              event.currentTarget.files &&
              event.currentTarget.files.length > 0
            ) {
              console.log(event.currentTarget.files[0]);
              setSelectedFile({
                ...selectedFile,
                tempImage: URL.createObjectURL(event.currentTarget.files[0]),
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
      {showImage ? (
        <LightBox
          open={showImage}
          icon={faImage}
          handleClose={() => setShowImage(false)}
          buttonTitle={"Close"}
          src={mValue && mValue.f}
          title={"Image Preview"}
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
export default Image;
