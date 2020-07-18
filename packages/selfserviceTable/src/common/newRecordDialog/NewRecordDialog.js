import React from "react";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import schemaCreator from "../../table/utility/schemaCreator";
const NewRecordDialog = (props) => {
  const tableHeader = props.tableHeader || [];
  let createValidationSchema = useCallback(() => {
    let schemaObj = {};
    tableHeader.forEach((el) => {
      schemaObj[el.key] = schemaCreator(el);
    });

    return schemaObj;
  }, [tableHeader]);
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

  let headerSpecs = createHeaderSpecs(tableHeader);
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
          {headerSpecs.map((el) => {
            return (
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
            );
          })}
        </div>
      )}
    </Formik>
  );
};
export default NewRecordDialog;
