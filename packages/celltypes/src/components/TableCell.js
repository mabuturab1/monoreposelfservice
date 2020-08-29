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
import ItemList from "./cellTypes/itemList/ItemList";
import NestedDropdown from "./cellTypes/nestedDropdown/NestedDropdown";
import { DummyInitValues } from "./common/constants/cellTypesDefaultValues";
import IconList from "./cellTypes/iconList/IconList";
import Audit from "./cellTypes/audit/Audit";
const useStyles = makeStyles(() => ({
  smallPadding: {
    padding: "0.5rem 1rem",
  },
  onlySidePadding: {
    padding: "0rem 1rem",
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
    ITEM_LIST: ItemList,
    NETSTED_DROPDOWN: NestedDropdown,
    ICON: IconList,
    AUDIT: Audit,
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
  if (item && item.type && item.type.toUpperCase() === "NESTED_DROPDOWN")
    return <NestedDropdown {...props} />;
  const submitData = (rowDataContent, dataToSubmit, updateType) => {
    console.log("submitting data", rowDataContent, dataToSubmit);
    if (props.updateFieldData)
      props.updateFieldData(
        props.rowData.id,
        {
          ...rowDataContent,
          [props.cellOriginalKey]: dataToSubmit,
        },
        props.cellOriginalKey,
        (isSuccess, afterUpdate = null) => {
          let { name, fallbackValue } = { ...props.item };
          console.log("IS SUCCESS", isSuccess, afterUpdate);
          if (!isSuccess && name) {
            console.log("FALLBACK VALUE IS", fallbackValue);
            if (fallbackValue) setFieldValue(name, fallbackValue);
            else
              setFieldValue(
                name,
                DummyInitValues[item.type.toUpperCase()] || ""
              );
          }

          if (isSuccess && afterUpdate && updateType !== "KEYUPDATE") {
            console.log(isSuccess, afterUpdate, updateType);
            updateFieldData(afterUpdate, "KEYUPDATE");
          }
        },
        updateType
      );
  };

  const SelectedComponent = fieldMap[item.type.toUpperCase()];
  let updateFieldData = (obtainedData, updateType = "KEYUPDATE") => {
    let { rowData } = { ...props };
    console.log("obtained data", obtainedData, "row data", rowData);
    if (!rowData) return;

    let rowDataContent = { ...rowData.data };
    let { validationSchema, name } = { ...props.item };

    if (validationSchema) {
      let schema = Yup.object().shape({
        [name]: validationSchema,
      });
      schema
        .isValid({ [name]: obtainedData })
        .then(function (val) {
          console.log("Schema is valid", val);
          if (val) submitData(rowDataContent, obtainedData, updateType);
        })
        .catch((err) => {
          console.log("SCHEMA NOT VALID", name, err);
        });
    } else submitData(rowDataContent, obtainedData, updateType);
  };

  if (item.type && SelectedComponent) {
    const componentData = {
      ...props.serverData,
      ...props.item,
      ...props.handlerFunctions,
      bearerToken: props.bearerToken,
      serverFieldType: item.type.toUpperCase(),
      rowData: props.rowData,
      tableActionsClicked: props.tableActionsClicked,
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
          maxWidth: "100%",
          overflow: "visible",
          position: "relative",
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
  appSchemaObj: PropTypes.object,
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
