import React, { useContext, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLock,
  faFilter,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./FilterHeader.module.scss";
import TableContext from "../context/TableContext";
import TableFilter from "../tableFilter/TableFilter";
import { Popover } from "@material-ui/core";
import { connect } from "react-redux";
import schemaCreator from "../utility/schemaCreator";
import * as actions from "../../store/actions";
import { Formik } from "formik";
import * as Yup from "yup";
const FilterHeader = (props) => {
  const searchConditions = [
    "less than (<)",
    "less than equals (<=)",
    "greater than (>)",
    "greater than equals (>=)",
    "contains (:>)",
    "equals (::)",
  ];
  const searchConditionsValues = ["<", "<=", ">", ">=", ":>", "::"];
  const filterDataState = props.filterData || { data: {}, numFilters: 0 };
  const tableHeader = (props.tableHeader || []).filter(
    (el) => el.key !== "indexIdNumber"
  );
  const queryConditions = ["WHERE", "AND", "OR"];
  const [filterData, setFilterData] = useState(filterDataState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  let updateReduxState = (filter) => {
    props.storeFilterData(filter);
    if (props.handleNewFilterData) props.handleNewFilterData(filter);
  };
  let initNewFilterValues = (
    { values },
    numFilterValue,
    removeLastFilter = false,
    storeState = false
  ) => {
    if (!tableHeader || tableHeader.length < 1) return;
    let filterInitValues = { ...filterDataState.data, ...values };

    if (numFilterValue < 1) {
      setFilterData({ data: {}, numFilters: 0 });

      if (storeState) {
        updateReduxState({ data: {}, numFilters: 0 });
      }
      return;
    }
    if (removeLastFilter) {
      let remFilter = numFilterValue + "list";
      ["", "QV", "FV", "SV"].forEach((el) => {
        delete filterInitValues[remFilter + el];
      });
    }
    for (let i = 0; i < numFilterValue; i++) {
      let filterName = i + "list";

      let tableField =
        (tableHeader || []).find((el) => el.key !== "indexIdNumber") || {};

      const initValues = [
        filterInitValues[filterName + ""] || "",
        filterInitValues[filterName + "QV"] || "WHERE",
        filterInitValues[filterName + "FV"] || tableField.key || "",
        filterInitValues[filterName + "SV"] || searchConditionsValues[0] || "",
      ];

      ["", "QV", "FV", "SV"].forEach((el, index) => {
        filterInitValues[filterName + el] = initValues[index];
      });
    }

    setFilterData({
      data: filterInitValues,
      numFilters: numFilterValue,
    });
    if (storeState) {
      updateReduxState({
        data: filterInitValues,
        numFilters: numFilterValue,
      });
    }
  };

  if (Object.keys(filterData.data).length < 1 && filterData.numFilters > 0) {
    initNewFilterValues({}, filterData.numFilters);
  }

  let validationScehma = {};

  const updateValidationSchema = (key, cellSpecs) => {
    let validator = {};
    validator[key] = schemaCreator(cellSpecs);

    validationScehma = { ...validationScehma, ...validator };
  };
  for (let i = 0; i < filterData.numFilters; i++) {
    let filterName = i + "list";
    ["", "QV", "FV", "SV"].forEach((el) => {
      updateValidationSchema(filterName + el, {
        type: "TEXT",
        data: { isRequired: true, minLength: 1 },
      });
    });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (reset) => {
    setAnchorEl(null);
    if (reset)
      setTimeout(() => {
        setFilterData(filterDataState);
      }, 100);
  };
  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      if (props.handleSearch) props.handleSearch(searchValue);
    }
  };
  if (Boolean(anchorEl) !== open) setOpen(Boolean(anchorEl));
  const id = open ? "simple-popover" : undefined;
  let editLockedClasses = [
    styles.topHeaderItemWrapper,
    styles.mediumPadding,
    styles.applyElevation,
  ];

  const tableContext = useContext(TableContext);
  let toggleEditLocked = (e) => {
    let val = tableContext.editAllowed;

    tableContext.setEditAllowed(!val);
  };
  if (tableContext.editAllowed) editLockedClasses.push(styles.lockDisabled);

  return (
    <div className={styles.wrapper}>
      <div
        onClick={handleClick}
        className={[
          styles.topHeaderItemWrapper,
          styles.mediumPadding,

          styles.applyElevation,
        ].join(" ")}
      >
        <FontAwesomeIcon icon={faFilter} className={styles.icon} />
        <span className={styles.label}>Filter</span>
      </div>
      <div className={editLockedClasses.join(" ")} onClick={toggleEditLocked}>
        <FontAwesomeIcon
          icon={tableContext.editAllowed ? faUnlock : faLock}
          className={styles.icon}
        />
        <span className={styles.label}>
          {tableContext.editAllowed ? "Edit Unlocked" : "Edit Locked"}
        </span>
      </div>
      <div
        className={[
          styles.topHeaderItemWrapper,
          styles.searchWrapper,
          styles.applyElevation,
        ].join(" ")}
      >
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input
          className={styles.input}
          placeholder="Search"
          value={searchValue}
          onKeyDown={handleKeydown}
          onChange={(e) => {
            let val = e.currentTarget.value;
            if (
              (!val || val === "") &&
              val !== searchValue &&
              props.handleSearch
            )
              props.handleSearch(val);
            setSearchValue(e.currentTarget.value);
          }}
        />
      </div>

      <Formik
        initialValues={filterData.data}
        enableReinitialize={true}
        validationSchema={Yup.object().shape(validationScehma)}
        onSubmit={(values, actions) => {
          updateReduxState({
            data: values,
            numFilters: filterData.numFilters,
          });

          handleClose(false);
        }}
      >
        {(mProps) => (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
              handleClose(true);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className={styles.filterWrapper}>
              <TableFilter
                {...{
                  queryConditions,
                  searchConditions,
                  searchConditionsValues,
                  tableFields: tableHeader,
                }}
                numFilters={filterData.numFilters}
                filterFormData={mProps}
              />

              <div className={styles.buttonWrapper}>
                <div>
                  <button
                    onClick={(e) => {
                      let numberOfFilters = filterData.numFilters + 1;
                      initNewFilterValues(mProps, numberOfFilters);
                    }}
                    className={styles.filterButton}
                  >
                    Add Filter
                  </button>
                  {filterData.numFilters > 0 ? (
                    <button
                      onClick={(e) => {
                        if (filterData.numFilters < 1) return;
                        let numberOfFilters = filterData.numFilters - 1;

                        initNewFilterValues(
                          mProps,
                          numberOfFilters,
                          true,
                          filterDataState.numFilters > 0
                        );
                      }}
                      className={[styles.filterButton, styles.danger].join(" ")}
                    >
                      Remove Filter
                    </button>
                  ) : null}
                </div>
                <div>
                  {filterData.numFilters ? (
                    <button
                      onClick={(e) => {
                        mProps.handleSubmit();
                      }}
                      className={styles.filterButton}
                    >
                      Apply Filter
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </Popover>
        )}
      </Formik>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    filterData: state.filterData,
    tableHeader: state.tableHeader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeFilterData: (data) => dispatch(actions.getFilterData(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(FilterHeader));
