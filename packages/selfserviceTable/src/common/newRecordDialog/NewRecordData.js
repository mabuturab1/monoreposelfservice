import React, { useCallback, useRef } from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreatorNewRecord from "../../table/utility/schemaCreatorNewRecord";
import * as Yup from "yup";
import { Formik } from "formik";
import { DocCells } from "../../table/utility/cellTypes";
import styles from "./NewRecordDialog.module.scss";

import { Button, CircularProgress } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave, faRedo } from "@fortawesome/free-solid-svg-icons";
import { DataUpdateStatus } from "../../table/constants/Constants";
import { DummyInitValues } from "@selfservicetable/celltypes/src/components/common/constants/cellTypesDefaultValues";

const NewRecordData = (props) => {
  let { dataUpdateStatus } = props;
  if (!dataUpdateStatus) dataUpdateStatus = DataUpdateStatus.idle;
  const { handleClose } = props;
  const tableHeader = (props.tableHeader || []).filter(
    (el) => el.key !== "indexIdNumber" && el.key !== "actions"
  );
  const resultData = useRef({});
  const createHeaderSpecs = useCallback(() => {
    let cellSpecs = [];
    let updateTableHeaderProps = (type, data) => {
      return {
        ...data,
        isRequired:
          data.isRequired &&
          type !== "NESTED_DROPDOWN" &&
          type !== "CONTACT" &&
          type !== "ITEM_LIST",
      };
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
      let updatedEl = { ...el, data: { ...el.data } };
      if (el.type === "EMAIL")
        updatedEl = { ...updatedEl, data: { ...updatedEl.data, email: true } };

      schemaObj[el.key] = schemaCreatorNewRecord(updatedEl);
    });
    let nestedDropdownItems = specs.filter(
      (el) => el.type === "NESTED_DROPDOWN"
    );
    nestedDropdownItems.forEach((item) => {
      if (item.data && item.data.fields) {
        let list = item.data.fields;

        list.forEach((el) => {
          schemaObj[item.key + el.key] = schemaCreatorNewRecord({
            ...el,
            data: { ...el },
          });
          console.log(
            "ASSIGNING NESTED DROPDOWN",
            item.key + el.key,
            schemaObj[item.key + el.key]
          );
        });
      }
    });

    return schemaObj;
  }, [createHeaderSpecs]);
  const getPadding = (type) => {
    if (type === "DROPDOWN") return undefined;
    if (type === "SWITCH") return "0px 1rem";
    return "0.3rem 1rem";
  };
  let getInitValues = () => {
    let data = {};
    let specs = createHeaderSpecs(tableHeader);
    specs.forEach((el) => {
      if (el.data.isRequired && !el.data.isDisabled) {
        data[el.key] = DummyInitValues[el.key];
      } else data[el.key] = null;
    });
    let nestedDropdownItems = specs.filter(
      (el) => el.type === "NESTED_DROPDOWN"
    );
    nestedDropdownItems.forEach((item) => {
      if (item.data && item.data.fields) {
        let list = item.data.fields;
        list.forEach((el) => {
          console.log("ASSIGNING TO NESTED DROPDOWN", el.key);
          data[item.key + el.key] = DummyInitValues[el.key];
        });
      }
    });
    return data;
  };
  let headerSpecs = createHeaderSpecs(tableHeader);
  let validationSchema = createValidationSchema();

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
  const getTableHeaderCell = (key) => {
    return tableHeader.find((el) => el.key === key);
  };

  const submitData = () => {
    let staticValues = { ...resultData.current };
    let docValues = {};
    if (props.onSubmit) {
      Object.keys(staticValues).forEach((el) => {
        let myCell = getTableHeaderCell(el);
        if (!myCell || !myCell.type) return;
        if (DocCells.includes(myCell.type.toUpperCase())) {
          docValues[el] = staticValues[el];
          delete staticValues[el];
        }
      });
      props.onSubmit(staticValues, docValues);
    }
  };
  const updateFieldData = (rowId, data, newKey, isSuccess) => {
    resultData.current = { ...resultData.current, ...data };
    isSuccess(true);
  };
  const getSaveButtonStatus = () => {
    switch (dataUpdateStatus) {
      case DataUpdateStatus.idle:
      case DataUpdateStatus.updated:
      default:
        return (
          <React.Fragment>
            <FontAwesomeIcon
              icon={faSave}
              size={"lg"}
              className={styles.icon}
            />
            Save
          </React.Fragment>
        );
      case DataUpdateStatus.updating:
        return (
          <div style={{ color: "white" }}>
            <CircularProgress size={20} color="inherit" />
          </div>
        );
      case DataUpdateStatus.error:
        return (
          <React.Fragment>
            <FontAwesomeIcon icon={faRedo} className={styles.icon} />
            Try Again
          </React.Fragment>
        );
    }
  };

  const handleDataSubmission = (handleSubmit, errors, touched) => {
    handleSubmit();
    console.log(errors, touched);
  };
  return (
    <Formik
      initialValues={getInitValues()}
      validationSchema={Yup.object().shape(createValidationSchema())}
      onSubmit={(values, actions) => {
        submitData();
        // handleClose();
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
              style={{ color: "#4A4A4A", cursor: "pointer" }}
            />
          </div>
          {headerSpecs.map((el, index) => {
            let { data } = el;
            if (!data) data = {};

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
                    myKey={el.key}
                    cellOriginalKey={el.key}
                    rowData={{ data: {} }}
                    updateFieldData={updateFieldData}
                    handlerFunctions={{
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      setFieldValue,
                      setFieldTouched,
                    }}
                    disableReadOnlyMode={true}
                    customStyles={{
                      // border: "1px solid rgba(112,112,112,0.2)",
                      // borderRadius: "0.6rem",
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
              style={{ marginRight: "1.4rem" }}
              onClick={handleClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDataSubmission(handleSubmit, errors, values)}
              variant="contained"
              color="primary"
              style={{ fontSize: "0.75rem" }}
            >
              {getSaveButtonStatus()}
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};
export default NewRecordData;
