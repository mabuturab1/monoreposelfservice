import React, { useState, useCallback, useRef } from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreator from "../../table/utility/schemaCreator";
import { Dialog, makeStyles, Button } from "@material-ui/core";
import styles from "./NewRecordDialog.module.scss";
import * as Yup from "yup";
import { Formik } from "formik";
import { DummyInitValues } from "../../table/utility/cellTypes";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const NewRecordDialog = (props) => {
  const classes = useStyles();
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

    return schemaObj;
  }, [createHeaderSpecs]);

  const [open, setOpen] = React.useState(false);

  const handleClick = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let validationSchema = createValidationSchema();

  const id = open ? "simple-popover" : undefined;
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

  return (
    <React.Fragment>
      <div onClick={handleClick}>{props.children}</div>
      <Dialog
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
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
              <div className={styles.headerTitle}>
                <h5
                  className={styles.labelText}
                  style={{ textAlign: "center", marginLeft: "4px" }}
                >
                  New Record
                </h5>
              </div>
              {headerSpecs.map((el, index) => {
                let { data } = el;
                if (!data) data = {};

                return (
                  <div key={index} className={styles.editItemWrapper}>
                    <div className={styles.labelWrapper}>
                      <p className={[styles.label, styles.labelText].join(" ")}>
                        {data.label}
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
                        border: "1px solid #707070",
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
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
};
export default NewRecordDialog;
