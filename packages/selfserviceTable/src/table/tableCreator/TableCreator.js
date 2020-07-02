import React, { useEffect, useState, useCallback } from "react";
import * as actions from "../../store/actions";

import { connect } from "react-redux";

import * as Yup from "yup";
import schemaCreator from "../utility/schemaCreator";
import { Formik } from "formik";
import FilterHeader from "../filterHeader/FilterHeader";
import PropTypes from "prop-types";
import TableContext from "../context/TableContext";
import styles from "./TableCreator.module.scss";
import InfiniteLoader from "../infiniteLoader/InfiniteLoader";
import { Paper } from "@material-ui/core";
import InfoDialog from "../infoDialog/InfoDialog";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";

const TableCreator = (props) => {
  const tableData = props.tableData || [];
  const tableHeader = props.tableHeader || [];

  const [editAllowed, setEditAllowed] = useState(props.editAllowed || true);

  let {
    apiUrl,
    currentReportId,

    fetchTableData: mFetchTableData,
    fetchTableHeader: mFetchTableHeader,
    updateApiUrl: mUpdateApiUrl,
  } = {
    ...props,
  };
  const [queryParams, setQueryParams] = useState({
    pageNumber: 0,
    pageSize: 10,
    key: "",
    order: "",
    isNewKey: false,
    filters: "",
    search: "",
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
    tableData.forEach((td) => {
      cellSpecs.forEach((el) => {
        prevSchema[getKey(td.id, el.key)] = schemaObj[el.key];
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
    mFetchTableData(
      apiUrl,
      currentReportId,
      {
        pageNumber: queryParams.pageNumber,
        pageSize: queryParams.pageSize,
        sortBy: queryParams.key !== "" ? queryParams.key : undefined,
        sortDirection: queryParams.order !== "" ? queryParams.order : undefined,
        filters: queryParams.filters !== "" ? queryParams.filters : undefined,
        search: queryParams.search !== "" ? queryParams.search : undefined,
      },
      queryParams.isNewKey
    );
  }, [mFetchTableData, apiUrl, currentReportId, queryParams]);

  const updateApiUrl = useCallback(() => {
    mUpdateApiUrl(apiUrl);
  }, [mUpdateApiUrl, apiUrl]);

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
  let getSortOrder = (data, isNewKey) => {
    if (isNewKey) return "ASC";
    if (data === "") return "ASC";
    if (data === "ASC") return "DESC";
    if (data === "DESC") return "";
  };
  let onHeaderClicked = (key) => {
    let currentSortOrder = getSortOrder(
      queryParams.order,
      key !== queryParams.key
    );

    let newQueryParams = {};
    if (key !== "indexIdNumber") {
      newQueryParams = {
        ...queryParams,
        key: currentSortOrder !== "" ? key : "",
        order: currentSortOrder,
        isNewKey:
          key !== queryParams.key || currentSortOrder !== queryParams.order,
      };

      if (newQueryParams.isNewKey) {
        newQueryParams.pageNumber = 0;
      }
      setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    fetchTableData(apiUrl, currentReportId, queryParams, queryParams.isNewKey);
  }, [fetchTableData, apiUrl, currentReportId, queryParams]);
  useEffect(() => {
    if (!apiUrl) return;
    updateApiUrl(apiUrl);
  }, [apiUrl, updateApiUrl]);

  useEffect(() => {
    fetchTableHeader(apiUrl, currentReportId);
  }, [fetchTableHeader, apiUrl, currentReportId]);
  const updateFieldData = (rowId, data, newKey, isSuccess) => {
    props.updateFieldData(
      props.apiAddress,
      props.currentReportId,
      rowId,
      data,
      newKey,
      isSuccess
    );
  };
  let columnsWidth = {};
  tableHeader.forEach((el) => {
    let type = el.type || "";
    if (el.key === "indexIdNumber") columnsWidth[el.key] = 70;
    else if (type.toUpperCase() === "DATETIME") columnsWidth[el.key] = 200;
    else columnsWidth[el.key] = 160;
  });
  let handleNewFilterData = (filterData) => {
    let newFilter = "";
    const { data } = filterData;

    if (data == null) return;
    let queryMap = {
      WHERE: "&",
      AND: "&",
      OR: "&",
    };
    for (let i = 0; i < (filterData.numFilters || 0); i++) {
      if (i > 0)
        newFilter =
          newFilter + (queryMap[data[i + "listQV"]] || "&") + "filters=";
      newFilter =
        newFilter + data[i + "listFV"] + data[i + "listSV"] + data[i + "list"];
    }
    if (newFilter !== queryParams.filters) {
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
      {props.tableHeader && props.tableHeader.length > 0 ? (
        <div className={styles.filterHeader}>
          <div
            style={{ width: tableWidth, maxWidth: "100vw", margin: "0 auto" }}
          >
            <FilterHeader
              handleNewFilterData={handleNewFilterData}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      ) : null}
      <div className={styles.wrapper}>
        <Paper
          style={{
            margin: "0 auto",
            width: tableData.length > 0 ? tableWidth : "100vw",
          }}
        >
          <InfoDialog
            open={(props.serverError && props.serverError.length > 0) === true}
            icon={faExclamationCircle}
            handleClose={() => props.removeError()}
            buttonTitle={"Okay"}
            content={props.serverError}
            title={"Sorry"}
          />

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
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={50}
                    width={50}
                    timeout={0} //3 secs
                  />
                </div>
              ) : (
                <InfiniteLoader
                  isNextPageLoading={props.tableDataPending}
                  loadNextPage={loadMoreItems}
                  tableData={props.tableData}
                  tableHeader={props.tableHeader}
                  cellSpecs={createHeaderSpecs(tableHeader)}
                  formData={formData}
                  totalReportItems={props.totalReportItems}
                  columnsWidth={columnsWidth}
                  validationSchema={createValidationSchema()}
                  sortByColumn={queryParams}
                  onHeaderClicked={onHeaderClicked}
                  updateFieldData={updateFieldData}
                />
              )
            }
          </Formik>
        </Paper>
      </div>
    </TableContext.Provider>
  );
};
TableCreator.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  editAllowed: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => {
  return {
    apiAddress: state.apiAddress,
    currentReportId: state.currentReportId,
    tableData: state.tableData,
    tableHeader: state.tableHeader,
    serverError: state.serverError,

    tableHeaderPending: state.tableHeaderPending,
    tableDataPending: state.tableDataPending,
    totalReportItems: state.totalReportItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTableHeader: (apiUrl, reportId) =>
      dispatch(actions.getTableHeader(apiUrl, reportId)),
    fetchTableData: (apiUrl, reportId, params, isNewData) =>
      dispatch(actions.getTableData(apiUrl, reportId, params, isNewData)),
    removeError: () => dispatch(actions.removeError()),
    clearTableData: () => dispatch(actions.clearTableData()),
    updateApiUrl: (apiAddress) => dispatch(actions.updateApiUrl(apiAddress)),
    updateFieldData: (apiUrl, reportId, rowId, data, newKey, isSuccess) =>
      dispatch(
        actions.updateFieldData(
          apiUrl,
          reportId,
          rowId,
          data,
          newKey,
          isSuccess
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TableCreator));
