import React from "react";
import styles from "./SingleFilter.module.scss";
import PropTypes from "prop-types";
import Dropdown from "@selfservicetable/celltypes/src/components/cellTypes/dropdown/Dropdown";
import Tooltip from "@selfservicetable/celltypes/src/components/tooltip/Tooltip";
const SingleFilter = (props) => {
  const {
    name,
    tableFields,
    searchConditions,
    searchConditionsValues,
    queryConditions,

    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    errors,
    touched,
    values,
  } = {
    ...props,
  };

  let handleFunctions = {
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.singleDropdown}>
        <Dropdown
          ignoreEditLocked={true}
          {...handleFunctions}
          name={name + "QV"}
          options={queryConditions}
          value={values[name + "QV"] || ""}
          error={errors[name + "QV"]}
          touched={touched[name + "QV"]}
        />
      </div>
      <div className={styles.singleDropdown}>
        <Dropdown
          ignoreEditLocked={true}
          name={name + "FV"}
          {...handleFunctions}
          options={(tableFields || []).map((el) => el.label)}
          valuesList={(tableFields || []).map((el) => el.key)}
          value={values[name + "FV"] || ""}
          touched={touched[name + "FV"]}
        />
      </div>
      <div className={styles.singleDropdown}>
        <Dropdown
          ignoreEditLocked={true}
          name={name + "SV"}
          {...handleFunctions}
          options={searchConditions}
          valuesList={searchConditionsValues}
          value={values[name + "SV"] || ""}
          touched={touched[name + "SV"]}
        />
      </div>
      <div className={styles.singleDropdown}>
        <Tooltip
          arrow
          title={errors[name] || ""}
          open={(errors[name] && touched[name]) === true}
          placement="bottom-start"
        >
          <input
            className={styles.inputStyle}
            name={name}
            value={values[name + ""] || ""}
            placeholder={"Enter query text"}
            onChange={handleFunctions.handleChange}
          />
        </Tooltip>
      </div>
    </div>
  );
};
SingleFilter.propTypes = {
  tableFields: PropTypes.array,
  searchConditions: PropTypes.array,
  queryConditions: PropTypes.array,
};
export default SingleFilter;
