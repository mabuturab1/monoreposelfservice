import React, { useRef, useCallback } from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreator from "../../table/utility/schemaCreator";
const CellEditDialog = (props) => {
  const fieldsData = useRef([
    {
      title: "Type",
      isRequired: true,
      label: "type.",
      type: "DROPDOWN",
      key: "id1",

      value: (props.headerCellSpecs && props.headerCellSpecs[0]) || "",
    },
    {
      title: "Key",
      isRequired: true,
      label: "key.",
      type: "TEXT",
      key: "id2",
      value: (props.headerCellSpecs && props.headerCellSpecs[0]) || "",
    },
    {
      title: "Label",
      isRequired: true,
      label: "label.",
      type: "TEXT",
      key: "id3",
      value: (props.headerCellSpecs && props.headerCellSpecs[0]) || "",
    },
    {
      title: "isDisabled",
      isRequired: true,
      label: "isDisabled.",
      type: "SWITCH",
      key: "id4",
      value: (props.headerCellSpecs && props.headerCellSpecs[0]) || "",
    },
    {
      title: "isRequired",
      isRequired: true,
      label: "type.",
      type: "SWITCH",
      key: "id5",
      value: (props.headerCellSpecs && props.headerCellSpecs[0]) || "",
    },
  ]);
  let createValidationSchema = useCallback(() => {
    let schemaObj = {};
    fieldsData.forEach((el) => {
      schemaObj[el.key] = schemaCreator(el);
    });

    return schemaObj;
  }, [fieldsData]);
  let getInitValues = () => {
    let data = {};
    fieldsData.forEach((el) => {
      data[el.key] = el.value;
    });
    return data;
  };
  let cellTypes = [];
  return (
    <Formik
      initialValues={getInitValues()}
      validationSchema={createValidationSchema()}
      onSubmit={(values, actions) => {
        console.log("values", values);
        console.log("actions", actions);
      }}
    >
      {({
        handleBlur,
        handleSubmit,
        handleChange,
        setFieldValue,
        setFieldTouched,
        values,
        errors,
        touched,
      }) => (
        <div>
          <h5>Edit</h5>
          {fieldsData.map((el) => {
            <div>
              <p>{el.title}</p>
              <MyTableCell
                handlerFunctions={{
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  setFieldValue,
                  setFieldTouched,
                }}
                item={{
                  name: el.key,
                  value: values[el.key] || "",
                  error: errors ? errors[el.key] : null,
                  touched: touched ? touched[el.key] === true : false,
                  validationSchema: validationSchema[el.key],
                }}
              />
            </div>;
          })}
        </div>
      )}
    </Formik>
  );
};
export default CellEditDialog;
