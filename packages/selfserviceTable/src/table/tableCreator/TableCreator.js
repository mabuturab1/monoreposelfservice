import React, { useEffect, useState, useCallback } from "react";

import * as Yup from "yup";
import schemaCreator from "../utility/schemaCreator";
import { Formik } from "formik";
import FilterHeader from "../filterHeader/FilterHeader";
import PropTypes from "prop-types";
import TableContext from "../context/TableContext";
import CellTypeContext from "../context/CellTypeContext";
import styles from "./TableCreator.module.scss";
import InfiniteLoader from "../infiniteLoader/InfiniteLoader";
import { Paper } from "@material-ui/core";
import InfoDialog from "../infoDialog/InfoDialog";
import * as moment from "moment";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import { CellTypes } from "../utility/cellTypes";
import { getFormattedDate } from "../utility/objectsFunctions";
const TableCreator = (props) => {
  let {
    contentAddAble,

    contentEditAble,
    contentDeleteAble,
    fieldAddAble,
    fieldEditAble,
    fieldDeleteAble,
  } = { ...props };
  const tableData = props.tableData || [];
  let concatArr = [];
  if (fieldAddAble !== false)
    concatArr = [
      {
        key: "%OPEN_NEW_FIELD_DIALOG%",
        icon: "Add",
        label: "Add",
        isIcon: true,
      },
    ];
  if (contentDeleteAble !== false)
    concatArr.push({
      key: "actions",
      type: "ICON",
      label: "Actions",
    });
  if (!props.tableHeader || props.tableHeader.length < 1) concatArr = [];
  const tableHeader = (props.tableHeader || []).concat(...concatArr);

  const [editAllowed, setEditAllowed] = useState(
    props.editAllowed != null ? props.editAllowed : true
  );

  let {
    apiUrl,
    currentReportId,
    staticData,
    fetchTableData: mFetchTableData,
    fetchTableHeader: mFetchTableHeader,
    updateApiUrl: mUpdateApiUrl,
    updateCurrentReportId: mUpdateCurrentReportId,
  } = {
    ...props,
  };
  const [queryParams, setQueryParams] = useState({
    pageNumber: 0,
    pageSize: 50,
    key: "",
    order: "",
    isNewKey: false,
    filters: new URLSearchParams(),
    search: "",
    end: new Date(moment.now()),
    start: new Date(moment().subtract(1, "months")),
  });
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
  const fetchTableHeader = useCallback(() => {
    mFetchTableHeader(apiUrl, currentReportId);
  }, [mFetchTableHeader, apiUrl, currentReportId]);
  const createValidationSchema = useCallback(() => {
    let prevSchema = {};
    let cellSpecs = createHeaderSpecs(tableHeader);
    let schemaObj = {};
    cellSpecs.forEach((el) => {
      schemaObj[el.key] = schemaCreator(el);
    });
    let nestedDropdownItems = cellSpecs.filter(
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
    tableData.forEach((td) => {
      cellSpecs.forEach((el) => {
        prevSchema[getKey(td.id, el.key)] = schemaObj[el.key];

        if (el.type === "NESTED_DROPDOWN" && el.data && el.data.fields) {
          const fieldsList = el.data.fields;
          fieldsList.forEach((fd) => {
            if (fd.key)
              prevSchema[getKey(td.id, el.key + fd.key)] =
                schemaObj[el.key + fd.key];
          });
        }
      });
    });
    return prevSchema;
  }, [tableData, createHeaderSpecs, tableHeader]);
  const getInitValues = useCallback(() => {
    const tableDataValues = {};
    tableData.forEach((td) => {
      const { data } = td;

      tableHeader.forEach((th) => {
        const { key } = th;

        tableDataValues[getKey(td.id, key)] = data[key];
      });
    });
    return tableDataValues;
  }, [tableData, tableHeader]);
  const getValidationSchemaObject = useCallback(() => {
    return Yup.object().shape(createValidationSchema());
  }, [createValidationSchema]);
  const fetchTableData = useCallback(() => {
    const params = new URLSearchParams();
    params.append("pageNumber", queryParams.pageNumber);
    params.append("pageSize", queryParams.pageSize);
    if (queryParams.key !== "") params.append("sortBy", queryParams.key);
    if (queryParams.order !== "")
      params.append("sortDirection", queryParams.order);
    if (queryParams.filters.toString() !== "") {
      queryParams.filters.forEach((value, key) => {
        params.append(key, value);
      });
    }
    if (queryParams.search !== "") params.append("search", queryParams.search);
    if (queryParams.start != null)
      params.append("start", getFormattedDate(queryParams.start));
    if (queryParams.end != null)
      params.append("end", getFormattedDate(queryParams.end));

    mFetchTableData(apiUrl, currentReportId, params, queryParams.isNewKey);
  }, [mFetchTableData, apiUrl, currentReportId, queryParams]);

  const updateApiUrl = useCallback(() => {
    mUpdateApiUrl(apiUrl);
  }, [mUpdateApiUrl, apiUrl]);
  const updateCurrentReportId = useCallback(() => {
    mUpdateCurrentReportId(currentReportId);
  }, [mUpdateCurrentReportId, currentReportId]);

  let getKey = (tableDataId, fieldKey) => {
    return tableDataId + fieldKey;
  };

  const loadMoreItems = ({ startIndex, stopIndex }) => {
    if (props.serverRequestPending) return;
    let newQueryParams = {
      ...queryParams,
      isNewKey: false,
      pageNumber: Math.max(0, queryParams.pageNumber + 1),
    };
    setQueryParams(newQueryParams);
  };
  // let getSortOrder = (data, isNewKey) => {
  //   if (isNewKey) return "ASC";
  //   if (data === "") return "ASC";
  //   if (data === "ASC") return "DESC";
  //   if (data === "DESC") return "";
  // };
  let onHeaderClicked = (key, selectedOption = "") => {
    // let currentSortOrder = getSortOrder(
    //   queryParams.order,
    //   key !== queryParams.key
    // );
    console.log("key is", key, "option is", selectedOption);
    let newQueryParams = {};
    if (key === "indexIdNumber") return;
    if (
      selectedOption &&
      (selectedOption === "unsorted" ||
        selectedOption === "ASC" ||
        selectedOption === "DESC")
    ) {
      newQueryParams = {
        ...queryParams,
        key: selectedOption !== "unsorted" ? key : "",
        order: selectedOption !== "unsorted" ? selectedOption : "",
        isNewKey:
          key !== queryParams.key || selectedOption !== queryParams.order,
      };

      if (newQueryParams.isNewKey) {
        newQueryParams.pageNumber = 0;
      }
      setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    if (!staticData)
      fetchTableData(
        apiUrl,
        currentReportId,
        queryParams,
        queryParams.isNewKey
      );
  }, [fetchTableData, apiUrl, currentReportId, queryParams, staticData]);
  useEffect(() => {
    if (!apiUrl) return;
    updateApiUrl(apiUrl);
  }, [apiUrl, updateApiUrl]);
  useEffect(() => {
    if (!currentReportId) return;
    updateCurrentReportId(currentReportId);
  }, [currentReportId, updateCurrentReportId]);

  useEffect(() => {
    if (!staticData) fetchTableHeader(apiUrl, currentReportId);
  }, [fetchTableHeader, apiUrl, currentReportId, staticData]);
  const updateFieldData = async (
    rowId,
    data,
    newKey,
    isSuccess,
    req = "KEYUPDATE"
  ) => {
    console.log(rowId, data, newKey);

    switch (req) {
      case "FILE_UPDATE":
      case "IMAGE_UPDATE":
        let localData = data[newKey];
        console.log("local image file url is", localData);

        if (!localData) return;
        let blob = await fetch(localData).then((r) => r.blob());
        let file = new File([blob], "test", { type: "image/png" });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", req === "IMAGE_UPDATE" ? "IMAGE" : "FILE");

        props.uploadFile(
          apiUrl,
          props.currentReportId,
          rowId,
          formData,
          newKey,
          isSuccess
        );
        break;
      default:
        props.updateFieldData(
          apiUrl,
          props.currentReportId,
          rowId,
          data,
          newKey,
          isSuccess
        );
    }
  };
  let columnsWidth = {};
  tableHeader.forEach((el) => {
    let type = el.type || "";
    if (el.key === "indexIdNumber") columnsWidth[el.key] = 70;
    else if (type.toUpperCase() === "DATETIME") columnsWidth[el.key] = 200;
    else if (type.toUpperCase() === "NESTED_DROPDOWN")
      columnsWidth[el.key] = 3 * 160;
    else columnsWidth[el.key] = 160;
  });
  let handleNewFilterData = (filterData) => {
    let newFilter = new URLSearchParams();
    const { data } = filterData;

    if (data == null) return;

    for (let i = 0; i < (filterData.numFilters || 0); i++) {
      newFilter.append(
        "filters",
        data[i + "listFV"] + data[i + "listSV"] + data[i + "list"]
      );
    }
    if (newFilter.toString() !== queryParams.filters.toString()) {
      setQueryParams({
        ...queryParams,
        pageNumber: 0,
        isNewKey: true,
        filters: newFilter,
      });
    }
  };
  const handleSearch = (searchValue) => {
    setQueryParams({
      ...queryParams,
      pageNumber: 0,
      isNewKey: true,
      search: searchValue || "",
    });
  };

  const handleDateRange = (dateRange) => {
    setQueryParams({
      ...queryParams,
      pageNumber: 0,
      isNewKey: true,
      start: dateRange.startDate,
      end: dateRange.endDate,
    });
  };
  const tableActionsClicked = (id, rowId) => {
    console.log("table actions clicked", id, rowId);
    if (id === "delete")
      if (props.deleteTableContent)
        props.deleteTableContent(apiUrl, currentReportId, rowId);
  };
  let tableWidth = Object.keys(columnsWidth)
    .map((el) => columnsWidth[el])
    .reduce((a, b) => a + b, 0);
  return (
    <TableContext.Provider
      value={{
        editAllowed: editAllowed,
        setEditAllowed: (val) => setEditAllowed(val),
      }}
    >
      <CellTypeContext.Provider
        value={{
          cellTypes: CellTypes,
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            height: "100vh",
            maxWidth: "100vw",
            minHeight: "600px",
          }}
        >
          {props.tableHeader && props.tableHeader.length > 0 && !staticData ? (
            <div className={styles.filterHeader}>
              <div
                style={{
                  width: tableWidth,

                  maxWidth: "100vw",
                  margin: "0 auto",
                }}
              >
                <FilterHeader
                  contentAddAble={contentAddAble}
                  contentEditAble={contentEditAble}
                  initDateRange={{
                    endDate: queryParams.end,
                    startDate: queryParams.start,
                  }}
                  handleNewFilterData={handleNewFilterData}
                  handleSearch={handleSearch}
                  handleDateRange={handleDateRange}
                />
              </div>
            </div>
          ) : null}
          <div className={styles.wrapper}>
            <Paper
              style={{
                margin: "0 auto",
                flex: 1,
                width:
                  tableData.length > 0
                    ? tableWidth
                    : staticData
                    ? "500px"
                    : "100vw",
              }}
            >
              {(props.serverError && props.serverError.length > 0) === true ? (
                <InfoDialog
                  open={
                    (props.serverError && props.serverError.length > 0) === true
                  }
                  icon={faExclamationCircle}
                  handleClose={() => props.removeError()}
                  buttonTitle={"Okay"}
                  content={props.serverError}
                  title={"Sorry"}
                />
              ) : null}

              <Formik
                initialValues={getInitValues()}
                enableReinitialize={true}
                validationSchema={getValidationSchemaObject()}
                onSubmit={(values, actions) => {
                  console.log("values", values);
                  console.log("actions", actions);
                }}
              >
                {(formData) =>
                  props.tableHeaderPending || tableData.length < 1 ? (
                    <div
                      style={{
                        width: staticData ? "500px" : "100vw",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {props.tableDataPending || props.tableHeaderPending ? (
                        <Loader
                          type="ThreeDots"
                          color="#00BFFF"
                          height={50}
                          width={50}
                          timeout={0} //3 secs
                        />
                      ) : (
                        <h4 className={styles.noData}>No Record Found</h4>
                      )}
                    </div>
                  ) : (
                    <InfiniteLoader
                      isNextPageLoading={props.tableDataPending}
                      loadNextPage={loadMoreItems}
                      tableData={props.tableData}
                      tableHeader={tableHeader}
                      cellSpecs={createHeaderSpecs(tableHeader)}
                      formData={formData}
                      totalReportItems={props.totalReportItems}
                      columnsWidth={columnsWidth}
                      validationSchema={createValidationSchema()}
                      sortByColumn={queryParams}
                      onHeaderClicked={onHeaderClicked}
                      updateFieldData={updateFieldData}
                      tableActionsClicked={tableActionsClicked}
                      tableStatus={{
                        contentAddAble,
                        contentEditAble,
                        contentDeleteAble,
                        fieldAddAble,
                        fieldEditAble,
                        fieldDeleteAble,
                      }}
                    />
                  )
                }
              </Formik>
            </Paper>
          </div>
        </div>
      </CellTypeContext.Provider>
    </TableContext.Provider>
  );
};
TableCreator.propTypes = {
  apiUrl: PropTypes.string,
  editAllowed: PropTypes.bool.isRequired,
  staticData: PropTypes.bool,
};
export default React.memo(TableCreator);
