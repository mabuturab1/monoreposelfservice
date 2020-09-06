import React, { useContext, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLock,
  faFilter,
  faUnlock,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import styles from "./FilterHeader.module.scss";
import TableContext from "../context/TableContext";
import TableFilter from "../tableFilter/TableFilter";
import { Popover, CircularProgress, Button } from "@material-ui/core";
import { connect } from "react-redux";
import schemaCreator from "../utility/schemaCreator";
import * as actions from "../../store/actions";
import { Formik } from "formik";
import * as Yup from "yup";
import NewRecordDialog from "../../common/newRecordDialog/NewRecordDialog";
import DateRangePicker from "@selfservicetable/celltypes/src/components/cellTypes/dateRangePicker/DateRangePicker";
import ToggleLogicButtons from "./ToggleLogicButtons";
import MenuButton from "../../common/menuButton/MenuButton";
const FilterHeader = (props) => {
  const tableContext = useContext(TableContext);
  const searchConditions = [
    "less than (<)",
    "less than equals (<=)",
    "greater than (>)",
    "greater than equals (>=)",
    "contains (:>)",
    "equals (::)",
  ];
  const searchConditionsValues = ["<", "<=", ">", ">=", ":>", "::"];
  const filterObj = props.filterData || {};
  const filterDataState = filterObj.filter || {
    idsArr: [],
    data: {},
    numFilters: 0,
  };
  const filterLogic = useRef(filterObj.logic || "AND");
  console.log("INIT VALUE FOR FILTER LOGIC", filterLogic.current);
  const tableData = props.tableData || [];
  const tableHeader = (props.tableHeader || []).filter(
    (el) => el.key !== "indexIdNumber"
  );
  const queryConditions = ["WHERE", "AND", "OR"];
  const [filterData, setFilterData] = useState(filterDataState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(props.initDateRange || {});
  const [searchValue, setSearchValue] = useState("");
  const [currentUpdateCycle, setCurrentUpdateCycle] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editAllowed, setEditAllowd] = useState(tableContext.editAllowed);

  const reportType = props.reportType;
  const intervalTimer = useRef(0);
  let updateReduxState = (filter) => {
    props.storeFilterData({ filter: filter, logic: filterLogic.current });
    if (props.handleNewFilterData)
      props.handleNewFilterData(filter, filterLogic.current);
  };
  let addNewFilter = ({ values }, numFilterValue) => {
    let filterName = new Date().getTime();

    let tableField =
      (tableHeader || []).find((el) => el.key !== "indexIdNumber") || {};
    let filterInitValues = {};
    const initValues = [
      "",
      "WHERE",
      tableField.key || "",
      searchConditionsValues[0] || "",
    ];

    ["", "QV", "FV", "SV"].forEach((el, index) => {
      filterInitValues[filterName + el] = initValues[index];
    });
    console.log("ADD NEW FILTER", { ...filterData });
    let newData = {
      idsArr: filterData.idsArr.concat(filterName),
      data: { ...filterData.data, ...values, ...filterInitValues },
      numFilters: numFilterValue,
    };
    setFilterData(newData);

    // updateReduxState(newData);
  };
  let updateFilterValues = (
    { values },
    numFilterValue,
    idToRemove = null,
    storeState = false
  ) => {
    if (!tableHeader || tableHeader.length < 1) return;
    let filterInitValues = { ...filterData.data, ...values };
    let newIdsArr = filterData.idsArr || [];
    if (numFilterValue < 1) {
      const resetState = { idsArr: [], data: {}, numFilters: 0 };
      setFilterData(resetState);

      if (storeState) {
        updateReduxState(resetState);
      }
      return;
    }
    if (idToRemove) {
      newIdsArr = filterData.idsArr.filter((el) => el !== idToRemove);
      let remFilter = idToRemove;
      ["", "QV", "FV", "SV"].forEach((el) => {
        delete filterInitValues[remFilter + el];
      });
    }

    for (let i = 0; i < newIdsArr.length; i++) {
      let filterName = newIdsArr[i];

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
      idsArr: newIdsArr,
      data: filterInitValues,
      numFilters: numFilterValue,
    });
    if (storeState) {
      updateReduxState({
        idsArr: newIdsArr,
        data: filterInitValues,
        numFilters: numFilterValue,
      });
    }
  };

  if (Object.keys(filterData.data).length < 1 && filterData.numFilters > 0) {
    addNewFilter({ values: {} }, filterData.numFilters);
  }

  let validationScehma = {};

  const updateValidationSchema = (key, cellSpecs) => {
    let validator = {};
    validator[key] = schemaCreator(cellSpecs);

    validationScehma = { ...validationScehma, ...validator };
  };
  for (let i = 0; i < filterData.idsArr.length; i++) {
    let filterName = filterData.idsArr[i];
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

  const checkUpdateCycle = (newValue) => {
    let value = props.getCurrentUpdateCycle();

    if (currentUpdateCycle !== value) {
      setCurrentUpdateCycle(value);
      setIsUpdating(false);

      setEditAllowd(newValue);
      clearInterval(intervalTimer.current);
    }
  };
  let toggleEditLocked = (e) => {
    let val = tableContext.editAllowed;
    setIsUpdating(true);
    setTimeout(() => tableContext.setEditAllowed(!val), 500);
    intervalTimer.current = setInterval(() => checkUpdateCycle(!val), 1000);
  };
  if (editAllowed) editLockedClasses.push(styles.lockDisabled);

  const onDateRangeSelect = (mDateRange) => {
    setDateRange(mDateRange);
    if (props.handleDateRange) props.handleDateRange(mDateRange);
  };
  let dateRangeClasses = [
    styles.dateRangeItem,
    styles.label,
    styles.topHeaderItemWrapper,
    styles.applyElevation,
    styles.backgroundWhite,
  ].join(" ");
  const getFormattedDate = (dateObj, fallback = "") => {
    if (!dateObj) return fallback;
    if (!(dateObj instanceof Date)) return fallback;

    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();

    return (
      year + "-" + getTwoDigitsNumber(month) + "-" + getTwoDigitsNumber(day)
    );
  };
  let getTwoDigitsNumber = (val) => {
    return ("0" + val.toString()).trim().slice(-2);
  };
  const exportDataTable = (id) => {
    let updatedParams = new URLSearchParams();
    if (props.queryParams) {
      props.queryParams.forEach((value, key) => {
        updatedParams.append(key, value);
      });
    }
    updatedParams.append("type", id);
    props.getReportExportId(
      props.apiUrl,
      reportType,
      props.currentReportId,
      updatedParams,

      (data) => {
        console.log("data of export is", data);
        if (data && data.exportId) props.getDataFromWebSocket(data.exportId);
      }
    );
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterButtonWrapper}>
        <div
          onClick={handleClick}
          className={[
            styles.topHeaderItemWrapper,
            styles.mediumPadding,

            styles.applyElevation,
          ].join(" ")}
        >
          <FontAwesomeIcon
            icon={faFilter}
            size={"lg"}
            className={styles.icon}
          />
          <span className={styles.label}>Filter</span>
        </div>
        {props.contentEditAble !== false ? (
          <div
            className={editLockedClasses.join(" ")}
            onClick={toggleEditLocked}
          >
            {isUpdating ? (
              <div className={styles.icon} style={{ color: "black" }}>
                <CircularProgress size={14} color="inherit" />
              </div>
            ) : (
              <FontAwesomeIcon
                size={"lg"}
                icon={editAllowed ? faUnlock : faLock}
                className={styles.icon}
              />
            )}
            <span className={styles.label}>
              {editAllowed ? "Edit Unlocked" : "Edit Locked"}
            </span>
          </div>
        ) : (
          false
        )}
        <MenuButton
          itemList={[
            { id: "XLSX", label: "XLSX" },
            { id: "PDF", label: "PDF" },
            { id: "CSV", label: "CSV" },
          ]}
          onItemSelected={(id) => exportDataTable(id)}
        >
          <div
            className={[
              styles.topHeaderItemWrapper,
              styles.mediumPadding,

              styles.applyElevation,
            ].join(" ")}
          >
            <FontAwesomeIcon
              size={"lg"}
              icon={faFileExport}
              className={styles.icon}
            />
            <span className={styles.label}>Export</span>
          </div>
        </MenuButton>
        <div>
          <DateRangePicker onDateRangeChanged={onDateRangeSelect}>
            <div className={styles.dateRangeWrapper}>
              <div className={dateRangeClasses} style={{ flex: 2 }}>
                {getFormattedDate(dateRange.startDate, "From")}
              </div>

              <div
                style={{
                  margin: "0px 0.3rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className={styles.text}>-</span>
              </div>

              <div className={dateRangeClasses} style={{ flex: 2 }}>
                {getFormattedDate(dateRange.endDate, "To")}
              </div>
            </div>
          </DateRangePicker>
        </div>
      </div>
      <div className={styles.recordWrapper}>
        <div className={styles.totalRecords}>
          <span className={styles.label}>
            Total Records:{props.totalReportItems ?? tableData.length}
          </span>
          {props.contentAddAble !== false ? (
            <NewRecordDialog>
              <div
                className={[
                  styles.topHeaderItemWrapper,
                  styles.mediumPadding,

                  styles.applyElevation,
                ].join(" ")}
              >
                <AddIcon fontSize="small" />
                <div
                  style={{
                    marginLeft: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span className={styles.label}>Add Record</span>
                </div>
              </div>
            </NewRecordDialog>
          ) : null}
        </div>
        <div
          className={[
            styles.topHeaderItemWrapper,
            styles.searchWrapper,
            styles.applyElevation,
          ].join(" ")}
        >
          <FontAwesomeIcon
            size={"lg"}
            icon={faSearch}
            className={styles.icon}
          />
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
      </div>
      <Formik
        initialValues={filterData.data}
        enableReinitialize={true}
        validationSchema={Yup.object().shape(validationScehma)}
        onSubmit={(values, actions) => {
          console.log("IDS ARR VALUE ON SUBMIT", values);
          updateReduxState({
            idsArr: filterData.idsArr,
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
              {filterData.numFilters > 0 ? (
                <h5 className={styles.headLabel}>Filter</h5>
              ) : null}
              <TableFilter
                {...{
                  queryConditions,
                  searchConditions,
                  searchConditionsValues,
                  tableFields: tableHeader,
                }}
                removeFilter={(id) =>
                  updateFilterValues(
                    mProps,
                    filterData.numFilters - 1,
                    id,
                    filterDataState.numFilters > 0
                  )
                }
                idsArr={filterData.idsArr}
                numFilters={filterData.numFilters}
                filterFormData={mProps}
              />

              <div className={styles.buttonWrapper}>
                <div className={styles.rowWrapper}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={(e) => {
                      addNewFilter(mProps, filterData.numFilters + 1);
                    }}
                    className={styles.materialFilterButton}
                  >
                    Add Filter
                  </Button>
                  {filterData.numFilters > 0 ? (
                    <ToggleLogicButtons
                      initValue={filterLogic.current}
                      onChange={(data) => (filterLogic.current = data)}
                    />
                  ) : null}
                  {/* {filterData.numFilters > 0 ? (
                    <Button
                      color="secondary"
                      onClick={(e) => {
                        if (filterData.numFilters < 1) return;
                        let numberOfFilters = filterData.numFilters - 1;

                        updateFilterValues(
                          mProps,
                          numberOfFilters,
                          true,
                          filterDataState.numFilters > 0
                        );
                      }}
                      className={[
                        styles.materialFilterButton,
                        styles.danger,
                      ].join(" ")}
                    >
                      Remove Filter
                    </Button>
                  ) : null} */}
                </div>
                <div className={styles.applyWrapper}>
                  {filterData.numFilters ? (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={(e) => {
                        mProps.handleSubmit();
                      }}
                      className={[
                        styles.materialFilterButton,
                        styles.applyButton,
                      ].join(" ")}
                    >
                      Apply Filter
                    </Button>
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
    filterData: state.table.filterData,
    tableHeader: state.table.tableHeader,
    tableData: state.table.tableData,
    currentReportId: state.table.currentReportId,
    apiUrl: state.table.apiAddress,
    reportType: state.table.reportType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeFilterData: (data) => dispatch(actions.getFilterData(data)),
    getDataFromWebSocket: (id) => dispatch(actions.getDataFromWebSocket(id)),
    getReportExportId: (apiUrl, reportType, reportId, params, callback) =>
      dispatch(
        actions.getReportExportId(
          apiUrl,
          reportType,
          reportId,

          params,
          callback
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(FilterHeader));
