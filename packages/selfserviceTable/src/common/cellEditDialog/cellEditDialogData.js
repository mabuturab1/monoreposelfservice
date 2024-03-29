import React, { useRef, useCallback, useContext } from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreator from "../../table/utility/schemaCreator";
import { Formik } from "formik";
import styles from "./cellEditDialog.module.scss";
import * as Yup from "yup";
import CodeEditor from "../codeEditor/CodeEditor";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CellTypesContext from "../../table/context/CellTypeContext";

const CellEditDialogData = React.forwardRef(
  (
    {
      cellSpecs = {},
      onDialogClosed,
      openAllowed,
      children,
      handleClick,
      handleClose,
      onSubmitData,
    },
    ref
  ) => {
    console.log("new cell specs in cellEdit DIalog is", cellSpecs);
    const cellTypeContext = useContext(CellTypesContext);
    const isNewField = !cellSpecs || Object.keys(cellSpecs).length < 1;
    const getInitCellSpecs = (cellSpecs) => {
      const newField = !cellSpecs || Object.keys(cellSpecs).length < 1;
      if (newField) return {};
      let updatedSpecs = {
        ...cellSpecs,
      };
      delete updatedSpecs.data;
      delete updatedSpecs.key;
      delete updatedSpecs.label;
      delete updatedSpecs.type;
      delete updatedSpecs.isDisabled;
      delete updatedSpecs.isRequired;
      return updatedSpecs;
    };
    let additionalSettings = useRef(getInitCellSpecs(cellSpecs));
    const fieldsData = useRef([
      {
        title: "Type",
        isRequired: true,
        label: "type.",
        type: "DROPDOWN",
        key: "type",
        placeholder: "Select type of header",
        options: (cellTypeContext.cellTypes || []).map((el) => el.label),
        valuesList: (cellTypeContext.cellTypes || []).map((el) => el.value),
        value:
          cellSpecs.type ||
          (cellTypeContext.cellTypes ? cellTypeContext.cellTypes[0].value : ""),
      },
      {
        title: "Key",
        isRequired: true,
        label: "key.",
        type: "TEXT",
        key: "key",
        placeholder: "Enter key here",
        value: cellSpecs.key || "",
      },
      {
        title: "Label",
        isRequired: true,
        label: "label.",
        type: "TEXT",
        key: "label",
        placeholder: "Enter label here",
        value: cellSpecs.label || "",
      },
      {
        title: "Is Disabled",
        isRequired: true,
        label: "isDisabled.",
        type: "SWITCH",
        key: "isDisabled",
        value: cellSpecs.isDisabled || false,
      },
      {
        title: "Is Required",
        isRequired: true,
        label: "type.",
        type: "SWITCH",
        key: "isRequired",
        value: cellSpecs.isRequired || false,
      },
    ]);

    let createValidationSchema = useCallback(() => {
      let schemaObj = {};
      fieldsData.current.forEach((el) => {
        schemaObj[el.key] = schemaCreator({ type: el.type, data: el });
      });

      return schemaObj;
    }, [fieldsData]);
    let getInitValues = () => {
      let data = {};
      fieldsData.current.forEach((el) => {
        data[el.key] = el.value;
      });

      return data;
    };

    let validationSchema = createValidationSchema();
    const getPadding = (type) => {
      if (type === "DROPDOWN") return undefined;
      if (type === "SWITCH") return "0px 1rem";
      return "0.3rem 1rem";
    };
    let updateAdditionalSettings = (settings) => {
      additionalSettings.current = JSON.parse(settings);
      console.log("obtained additional settings", additionalSettings.current);
    };
    return (
      <React.Fragment>
        <div onClick={handleClick}>{children}</div>
        <Formik
          initialValues={getInitValues()}
          validationSchema={Yup.object().shape(validationSchema)}
          onSubmit={(values, actions) => {
            console.log("values", values);
            handleClose();
            setTimeout(() => {
              if (onSubmitData)
                onSubmitData(
                  { ...values, ...additionalSettings.current },
                  (isSuccess) => {
                    console.log("success response is", isSuccess);
                  }
                );
            });
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
            <div className={styles.wrapper}>
              <div className={styles.headerTitle}>
                {isNewField ? null : (
                  <EditIcon style={{ color: "#4A4A4A" }} fontSize="small" />
                )}
                <h5
                  className={styles.labelText}
                  style={{ textAlign: "center", marginLeft: "4px" }}
                >
                  {isNewField ? "Add" : "Edit"}
                </h5>
              </div>
              {fieldsData.current.map((el, index) => {
                return (
                  <div key={index} className={styles.editItemWrapper}>
                    <div className={styles.labelWrapper}>
                      <p className={[styles.label, styles.labelText].join(" ")}>
                        {el.title}
                      </p>
                      <span className={styles.labelText}>:</span>
                    </div>

                    <MyTableCell
                      editAllowed={true}
                      isSmallPadding={true}
                      onlySidePadding={el.type === "SWITCH"}
                      handlerFunctions={{
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      disableReadOnlyMode={true}
                      serverData={{ ...el }}
                      customStyles={{
                        borderRadius: "0.6rem",
                        padding: getPadding(el.type),
                        width: "12rem",
                        boxSizing: "border-box",
                      }}
                      item={{
                        name: el.key,
                        value: values[el.key] != null ? values[el.key] : "",
                        error: errors ? errors[el.key] : null,
                        touched: touched ? touched[el.key] === true : false,
                        validationSchema: validationSchema[el.key],
                        type: el.type,
                      }}
                    />
                  </div>
                );
              })}
              <div className={styles.codeEditor}>
                <p className={styles.labelText}>Additional Settings:</p>
                <CodeEditor
                  updateAdditionalSettings={updateAdditionalSettings}
                  code={JSON.stringify(getInitCellSpecs(cellSpecs), null, 2)}
                  width={"19rem"}
                />
              </div>
              <div className={styles.buttonWrapper}>
                <Button
                  style={{ marginRight: "1.4rem" }}
                  onClick={handleClose}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </React.Fragment>
    );
  }
);
export default CellEditDialogData;
