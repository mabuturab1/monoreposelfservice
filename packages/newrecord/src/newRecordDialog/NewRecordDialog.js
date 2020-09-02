import React, { useState } from "react";
import NewRecordData from "./NewRecordData";

import { Dialog, makeStyles } from "@material-ui/core";

import { DataUpdateStatus } from "../constants/Constants";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "0.6rem",
  },
}));

const NewRecordDialog = (props) => {
  const classes = useStyles();
  let reportType = props.reportType;
  const tableHeader = props.tableHeader || [];
  const [open, setOpen] = useState(false);
  const [dataUpdateStatus, setDataUpdateStatus] = useState(
    DataUpdateStatus.idle
  );
  const handleClick = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id = open ? "simple-popover" : undefined;
  // const getFormData = async (localData, type) => {
  //   console.log("local image file url is", localData);

  //   if (!localData) return;
  //   let blob = await fetch(localData).then((r) => r.blob());
  //   let file = new File([blob], "test");
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("type", type);
  //   return formData;
  // };
  const getTableHeaderCell = (key) => {
    return tableHeader.find((el) => el.key === key);
  };
  const uploadDocs = (docValues, uploadComplete) => {
    if (!docValues || Object.keys(docValues).length < 1) return;
    let updatedDocValues = {};
    let numDocKeys = Object.keys(docValues).length;
    let currIndex = 0;
    let isWaitForData = false;
    setDataUpdateStatus(DataUpdateStatus.updating);
    Object.keys(docValues).forEach(async (el) => {
      let myCell = getTableHeaderCell(el);
      let type = "PDF";
      if (myCell && myCell.type.toUpperCase() === "IMAGE") type = "IMAGE";
      isWaitForData = true;
      console.log("uploading file", el);
      props.uploadFile(
        props.apiUrl,
        reportType,
        props.reportId,
        null,
        docValues[el],
        type,
        el,
        (isSuccess, result) => {
          console.log("IMAGE UPDATE RESULT IS", isSuccess, result);
          if (!isSuccess) setDataUpdateStatus(DataUpdateStatus.error);
          if (isSuccess) currIndex++;
          if (isSuccess && result) updatedDocValues[el] = result;
          if (currIndex >= numDocKeys) uploadComplete(updatedDocValues);
        },
        true
      );
    });
    if (!isWaitForData) uploadComplete({});
  };
  const onSubmit = (values, docValues) => {
    console.log("ON SUBMIT DATA IS", values, docValues);
    if (!docValues || Object.keys(docValues).length < 1) {
      submitStaticData(values);
      return;
    }
    uploadDocs(docValues, (uploadResult) => {
      console.log("upload result is", uploadResult);
      submitStaticData({ ...values, ...uploadResult });
    });
  };
  const submitStaticData = (values) => {
    if (!values || Object.keys(values).length < 1) return;
    setDataUpdateStatus(DataUpdateStatus.updating);
    props.addTableContent(
      props.apiUrl,
      props.reportType,
      props.reportId,
      values,
      (isSuccess) => {
        if (isSuccess) handleClose();
        setDataUpdateStatus(
          isSuccess ? DataUpdateStatus.updated : DataUpdateStatus.error
        );
      }
    );
  };
  return (
    <React.Fragment>
      <div onClick={handleClick}>{props.children}</div>
      <Dialog
        id={id}
        disableBackdropClick={true}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <NewRecordData
          {...props}
          dataUpdateStatus={dataUpdateStatus}
          handleClose={handleClose}
          onSubmit={onSubmit}
        />
      </Dialog>
    </React.Fragment>
  );
};
export default React.memo(NewRecordDialog);
