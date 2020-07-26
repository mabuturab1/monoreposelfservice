import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "./cellTypes/text/Text";
import TextArea from "./cellTypes/textArea/TextArea";
import TableCell from "@material-ui/core/TableCell";
import ReadOnlyText from "./cellTypes/readOnlyText/ReadOnlyText";
import SwitchButton from "./cellTypes/switchButton/SwitchButton";
import Dropdown from "./cellTypes/dropdown/Dropdown";
import Currency from "./cellTypes/currency/Currency";
import Image from "./cellTypes/image/Image";
import Rate from "./cellTypes/rate/Rate";
import DateTime from "./cellTypes/dateTime/DateTime";
import Checkbox from "./cellTypes/checkboxList/CheckboxList";
import Radio from "./cellTypes/radioList/RadioList";

import * as Yup from "yup";
import { makeStyles } from "@material-ui/core";
import OfficerSelect from "./cellTypes/officerSelect/OfficerSelect";
import ScanQr from "./cellTypes/scanQr/ScanQr";
import DocumentUpload from "./cellTypes/documentUpload/DocumentUpload";
import ContactData from "./cellTypes/contactData/ContactData";
import MyMap from "./cellTypes/myMap/MyMap";
const useStyles = makeStyles(() => ({
  smallPadding: {
    padding: "8px 16px",
  },
  onlySidePadding: {
    padding: "0px 16px",
  },
}));
const MyTableCell = (props) => {
  const classes = useStyles();
  const { setFieldValue } = { ...props.handlerFunctions };
  var { item } = props;
  const fieldMap = {
    TEXT: TextField,
    TEXT_AREA: TextArea,
    PHONENUMBER: TextField,
    EMAIL: TextField,
    NUMBER: TextField,
    DECIMAL: TextField,
    RATE: Rate,
    IMAGE: Image,
    DATETIME: DateTime,
    DROPDOWN: Dropdown,
    READONLY_TEXT: ReadOnlyText,
    SWITCH: SwitchButton,
    CURRENCY: Currency,
    CHECKBOX: Checkbox,
    RADIO: Radio,
    OFFICER_SELECT: OfficerSelect,
    SCAN_QR: ScanQr,
    DOCUMENT: DocumentUpload,
    CONTACT: ContactData,
    MAP: MyMap,
  };
  let getType = (val) => {
    switch (val) {
      case "READONLY_TEXT":
      case "TEXT":
      case "TEXT_AREA":
      case "PHONENUMBER":
      case "EMAIL":
      case "CURRENCY":
        return "text";
      case "NUMBER":
      case "DECIMAL":
        return "number";
      case "SWITCH":
        return "bool";
      default:
        return "text";
    }
  };
  const submitData = (rowDataContent, dataToSubmit) => {
    if (props.updateFieldData)
      props.updateFieldData(
        props.rowData.id,
        {
          ...rowDataContent,
          [props.cellOriginalKey]: dataToSubmit,
        },
        props.cellOriginalKey,
        (isSuccess) => {
          let { name, fallbackValue } = { ...props.item };

          if (!isSuccess && fallbackValue && name) {
            console.log("FALLBACK VALUE IS", fallbackValue);
            setFieldValue(name, fallbackValue);
          }
        }
      );
  };

  const SelectedComponent = fieldMap[item.type.toUpperCase()];
  let updateFieldData = (obtainedData) => {
    let { rowData } = { ...props };

    if (!rowData) return;

    let rowDataContent = { ...rowData.data };
    let { validationSchema, name } = { ...props.item };

    if (validationSchema) {
      let schema = Yup.object().shape({
        [name]: validationSchema,
      });

      schema.isValid({ [name]: obtainedData }).then(function (val) {
        if (val) submitData(rowDataContent, obtainedData);
      });
    } else submitData(rowDataContent, obtainedData);
  };
  if (item.type && SelectedComponent) {
    const componentData = {
      ...props.serverData,
      ...props.item,
      ...props.handlerFunctions,
      customStyles: props.customStyles,
      disableReadOnlyMode: props.disableReadOnlyMode,
      editAllowed: props.editAllowed != null ? props.editAllowed : true,
      updateFieldData: updateFieldData,
      type: getType(item.type.toUpperCase()),
    };

    return (
      <TableCell
        classes={{
          root: props.onlySidePadding
            ? classes.onlySidePadding
            : props.isSmallPadding
            ? classes.smallPadding
            : undefined,
        }}
        component="div"
        variant="body"
        key={props.myKey}
        className={props.className}
        style={{
          height: props.rowHeight,
          border: "none",
          fontFamily: "'Roboto', 'Open Sans', 'sans-serif'",
        }}
      >
        <SelectedComponent {...componentData} />
      </TableCell>
    );
  }
  return null;
};
MyTableCell.propTypes = {
  myKey: PropTypes.string,
  className: PropTypes.string,
  rowHeight: PropTypes.number,
  rowWidth: PropTypes.number,
  rowData: PropTypes.object,
  cellOriginalKey: PropTypes.string,
  serverData: PropTypes.object,
  customStyles: PropTypes.object,
  disableReadOnlyMode: PropTypes.bool,
  isSmallPadding: PropTypes.bool,
  onlySidePadding: PropTypes.bool,
  handlerFunctions: PropTypes.object.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fallbackValue: PropTypes.string | PropTypes.object | PropTypes.number,
    value: PropTypes.string | PropTypes.object | PropTypes.number,
    error: PropTypes.string,
    touched: PropTypes.bool,
    validationSchema: PropTypes.object,
  }).isRequired,
};

export default React.memo(MyTableCell);
