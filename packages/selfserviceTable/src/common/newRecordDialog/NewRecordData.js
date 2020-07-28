import React, { useState, useCallback, useRef } from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreator from "../../table/utility/schemaCreator";
import * as Yup from "yup";
import { Formik } from "formik";
import { DummyInitValues } from "../../table/utility/cellTypes";
import styles from "./NewRecordDialog.module.scss";

import { Dialog, makeStyles, Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlusCircle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const NewRecordData = (props) => {
  const { handleClose } = props;
  const tableHeader = props.tableHeader || [];

  const createHeaderSpecs = useCallback(() => {
    let cellSpecs = [];
    let updateTableHeaderProps = (type, data) => {
      return type !== "EMAIL"
        ? {
            ...data,
          }
        : { ...data, email: true };
    };

    for (let i = 0; i < tableHeader.length; i++) {
      const { key, type } = tableHeader[i];
      const tableHeaderProps = { ...tableHeader[i] };
      delete tableHeaderProps.key;
      delete tableHeaderProps.type;
      cellSpecs.push({
        key,
        type,
        data: updateTableHeaderProps(type, tableHeaderProps),
      });
    }
    return cellSpecs;
  }, [tableHeader]);
  let createValidationSchema = useCallback(() => {
    let schemaObj = {};
    let specs = createHeaderSpecs();
    specs.forEach((el) => {
      schemaObj[el.key] = schemaCreator(el);
    });
    let nestedDropdownItems = specs.filter(
      (el) => el.type === "NESTED_DROPDOWN"
    );
    nestedDropdownItems.forEach((item) => {
      if (item.data && item.data.fields) {
        let list = item.data.fields;
        list.forEach((el) => {
          schemaObj[item.key + el.key] = schemaCreator(el);
        });
      }
    });

    return schemaObj;
  }, [createHeaderSpecs]);
  const getPadding = (type) => {
    if (type == "DROPDOWN") return undefined;
    if (type === "SWITCH") return "0px 16px";
    return "5px 15px";
  };
  let getInitValues = () => {
    let data = {};
    let specs = createHeaderSpecs(tableHeader);
    specs.forEach((el) => {
      data[el.key] = DummyInitValues[el.type] || "";
    });

    return data;
  };
  let headerSpecs = createHeaderSpecs(tableHeader);
  let validationSchema = createValidationSchema();
  console.log("header specs are", headerSpecs);
  const isNestedDropdown = (el) => {
    return el.data && el.data.fields && el.type === "NESTED_DROPDOWN";
  };
  const getNestedDropdownLabel = (el) => {
    return (
      <React.Fragment>
        <p
          style={{ height: "2px" }}
          className={[styles.label, styles.labelText].join(" ")}
        ></p>
        <div className={styles.subFieldWrapper}>
          {el.data.fields.map((fd, i) => (
            <p
              key={i}
              className={[
                styles.label,
                styles.labelText,
                styles.subFieldItem,
              ].join(" ")}
            >
              {fd.label}
            </p>
          ))}
        </div>
      </React.Fragment>
    );
  };
  return (
    <Formik
      initialValues={getInitValues()}
      validationSchema={Yup.object().shape(createValidationSchema())}
      onSubmit={(values, actions) => {
        handleClose();
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
          <div className={styles.headerWrapper}>
            <span></span>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faPlusCircle} className={styles.icon} />
              <h5
                className={styles.labelText}
                style={{ textAlign: "center", marginLeft: "4px" }}
              >
                New Record
              </h5>
            </div>
            <FontAwesomeIcon
              icon={faTimes}
              className={styles.closeIcon}
              onClick={handleClose}
            />
          </div>
          {headerSpecs.map((el, index) => {
            let { data } = el;
            if (!data) data = {};
            console.log("el type is", el.type, { ...el, ...el.data });
            return (
              <React.Fragment key={index}>
                {isNestedDropdown(el) ? (
                  <div
                    className={styles.labelWrapper}
                    style={{ justifyContent: "flex-start" }}
                  >
                    <p className={[styles.label, styles.labelText].join(" ")}>
                      {data.label}
                    </p>

                    <span className={styles.labelText}>:</span>
                  </div>
                ) : null}

                <div className={styles.editItemWrapper}>
                  {isNestedDropdown(el) ? (
                    getNestedDropdownLabel(el)
                  ) : (
                    <div className={styles.labelWrapper}>
                      <p className={[styles.label, styles.labelText].join(" ")}>
                        {data.label}
                      </p>

                      <span className={styles.labelText}>:</span>
                    </div>
                  )}

                  <MyTableCell
                    editAllowed={true}
                    isSmallPadding={true}
                    onlySidePadding={el.type === "SWITCH"}
                    serverData={{ ...el, ...el.data }}
                    appSchemaObj={validationSchema}
                    appTouchedObj={touched}
                    appErrorObj={errors}
                    rowWidth={160}
                    handlerFunctions={{
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      setFieldValue,
                      setFieldTouched,
                    }}
                    disableReadOnlyMode={true}
                    customStyles={{
                      border: "1px solid rgba(112,112,112,0.2)",
                      borderRadius: "10px",
                      padding: getPadding(el.type),
                      width: "12rem",
                      boxSizing: "border-box",
                    }}
                    item={{
                      name: el.key,
                      value: values[el.key] || "",
                      error: errors ? errors[el.key] : null,
                      touched: touched ? touched[el.key] === true : false,
                      validationSchema: validationSchema[el.key],
                      type: el.type,
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}

          <div className={styles.buttonWrapper}>
            <Button
              style={{ marginRight: "20px" }}
              onClick={handleClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ fontSize: "12px" }}
            >
              <FontAwesomeIcon icon={faSave} className={styles.icon} />
              Save
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};
export default NewRecordData;
