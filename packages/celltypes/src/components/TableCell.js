import React from "react";
import PropTypes from "prop-types";
import TextField from "./cellTypes/text/Text";
import TextArea from "./cellTypes/textArea/TextArea";
import TableCell from "@material-ui/core/TableCell";
import ReadOnlyText from "./cellTypes/readOnlyText/ReadOnlyText";

import Dropdown from "./cellTypes/dropdown/Dropdown";

import Image from "./cellTypes/image/Image";
import Rate from "./cellTypes/rate/Rate";
import DateTime from "./cellTypes/dateTime/DateTime";
import * as Yup from "yup";

const MyTableCell = (props) => {
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
  };
  let getType = (val) => {
    switch (val) {
      case "READONLY_TEXT":
      case "TEXT":
      case "TEXT_AREA":
      case "PHONENUMBER":
      case "EMAIL":
        return "text";
      case "NUMBER":
      case "DECIMAL":
        return "number";
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
      editAllowed: props.editAllowed != null ? props.editAllowed : true,
      updateFieldData: updateFieldData,
      type: getType(item.type.toUpperCase()),
    };

    return (
      <TableCell
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
  rowData: PropTypes.object.isRequired,
  cellOriginalKey: PropTypes.string.isRequired,
  serverData: PropTypes.object.isRequired,
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
