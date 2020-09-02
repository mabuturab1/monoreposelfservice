import React, { useEffect, useState, useCallback, useRef } from "react";

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
import InfoDialog from "@selfservicetable/celltypes/src/components/common/infoDialog/InfoDialog";
import * as moment from "moment";
import {
  faExclamationCircle,
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
// import Loader from "react-loader-spinner";
import { CellTypes } from "../utility/cellTypes";
import { getFormattedDate } from "../utility/objectsFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableVirtualized from "../virtualized/TableVirtualized";

const TableCreator = (props) => {
  let {
    contentAddAble,
    contentEditAble,
    contentDeleteAble,
    fieldAddAble,
    fieldEditAble,
    fieldDeleteAble,
    createAt,
    fetchNewDataTrigger,
  } = { ...props };
  let tableWrapper = useRef(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const tempIsScrolling = useRef(false);
  const scrollTopTable = useRef(0);
  const noFreezeColumnMessage = useRef(0);
  const tableData = props.tableData || [];
  const [currentTrigger, setCurrentTrigger] = useState(
    fetchNewDataTrigger || 1
  );

  let concatArr = [];
  if (createAt)
    concatArr.push({
      key: "createAt",
      label: "Create At",
      type: "READONLY_TEXT",
    });

  if (fieldAddAble !== false)
    concatArr.push({
      key: "%OPEN_NEW_FIELD_DIALOG%",
      icon: "Add",
      label: "Add",
      isIcon: true,
    });

  if (!props.tableHeader || props.tableHeader.length < 1) concatArr = [];
  const dummyTableHeader = [];
  let dummyColumnWidth = {};
  for (let i = 0; i < 20; i++) {
    dummyTableHeader.push({
      label: "",
      key: i.toString(),
      skeletonPreview: "%%SKELETON_PREVIEW%%",
    });
    dummyColumnWidth[i] = Math.floor(windowDimensions.width / 10);
  }
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  const getDummyTableData = () => {
    const showDummyHeader = props.tableHeaderPending && tableHeader.length < 1;
    let theader = showDummyHeader ? dummyTableHeader : tableHeader;
    let dummyTableData = [];
    let totalItems = 50;
    if (props.totalReportItems) {
      totalItems = Math.min(50, props.totalReportItems - tableData.length);
      console.log(
        "total items are",
        totalItems,
        props.totalReportItems - tableData.length
      );
    }
    for (let i = 0; i < totalItems; i++) {
      let dummyRow = {};
      for (let i = 0; i < theader.length; i++) {
        dummyRow[theader[i].key] = "%%SKELETON_PREVIEW%%";
      }
      dummyTableData.push(dummyRow);
    }

    if (
      !showDummyHeader &&
      (showSkeletonForTableData() || props.tableDataPending)
    ) {
      console.log("RETURNING DUMMY DATA", dummyTableData);
      return (props.tableData || []).concat(dummyTableData);
    }
    return dummyTableData;
  };

  const tableHeader = (props.tableHeader || [])
    .concat(...concatArr)
    .map((el) => {
      if (el.key === "indexIdNumber" && contentDeleteAble)
        return {
          ...el,
          iconsArr: ["delete"],
        };
      else return { ...el };
    });

  const [editAllowed, setEditAllowed] = useState(
    props.editAllowed != null ? props.editAllowed : true
  );
  let intervalTimer = useRef(null);
  let timeoutTimer = useRef(null);
  let {
    apiUrl,
    currentReportId,
    reportType,
    staticData,
    fetchTableData: mFetchTableData,
    fetchTableHeader: mFetchTableHeader,
    updateApiUrl: mUpdateApiUrl,
    updateCurrentReportId: mUpdateCurrentReportId,
  } = {
    ...props,
  };
  const currentUpdateCycle = useRef(0);
  const [queryParams, setQueryParams] = useState({
    pageNumber: 0,
    pageSize: 50,
    key: "",
    order: "",
    isNewKey: false,
    filters: new URLSearchParams(),
    filterLogic: "AND",
    search: "",
    end: new Date(moment.now()),
    start: new Date(moment().subtract(1, "years")),
  });
  if (fetchNewDataTrigger && fetchNewDataTrigger !== currentTrigger) {
    console.log("triggering new data fetch");
    setCurrentTrigger(fetchNewDataTrigger);
    setQueryParams({
      ...queryParams,
      pageNumber: 0,
      isNewKey: true,
    });
  }
  const createHeaderSpecs = useCallback(() => {
    let cellSpecs = [];
    let updateTableHeaderProps = (type, data) => {
      return {
        ...data,
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
  const fetchTableHeader = useCallback(() => {
    mFetchTableHeader(apiUrl, reportType, currentReportId);
  }, [mFetchTableHeader, apiUrl, reportType, currentReportId]);
  const createValidationSchema = useCallback(() => {
    let prevSchema = {};
    let cellSpecs = createHeaderSpecs(tableHeader);
    let schemaObj = {};
    cellSpecs.forEach((el) => {
      let updatedEl = { ...el, data: { ...el.data } };
      if (el.type === "EMAIL")
        updatedEl = { ...updatedEl, data: { ...updatedEl.data, email: true } };
      schemaObj[el.key] = schemaCreator(updatedEl);
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
  const getCurrentQueryParams = () => {
    const params = new URLSearchParams();
    params.append("pageNumber", queryParams.pageNumber);
    params.append("pageSize", queryParams.pageSize);
    if (queryParams.key !== "") params.append("sortBy", queryParams.key);
    if (queryParams.order !== "")
      params.append("sortDirection", queryParams.order);
    if (
      queryParams.filters.toString() !== "" &&
      queryParams.filterLogic != ""
    ) {
      queryParams.filters.forEach((value, key) => {
        params.append(key, value);
      });
      params.append("logic", queryParams.filterLogic);
    }
    if (queryParams.search !== "") params.append("search", queryParams.search);
    if (queryParams.start != null)
      params.append("start", getFormattedDate(queryParams.start));
    if (queryParams.end != null)
      params.append("end", getFormattedDate(queryParams.end));
    return params;
  };
  const fetchTableData = useCallback(() => {
    console.log("FETCHING TABLE DATA");
    const params = getCurrentQueryParams();
    mFetchTableData(
      apiUrl,
      reportType,
      currentReportId,
      params,
      queryParams.isNewKey
    );
  }, [mFetchTableData, apiUrl, reportType, currentReportId, queryParams]);

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
    if (props.updateQueryParams) props.updateQueryParams(newQueryParams);
  };

  let onHeaderClicked = (key, selectedOption = "") => {
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
      if (props.updateQueryParams) props.updateQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    if (!staticData)
      fetchTableData(
        apiUrl,
        reportType,
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
  }, [fetchTableHeader, apiUrl, currentReportId, staticData, currentTrigger]);
  useEffect(() => {
    currentUpdateCycle.current += 1;
  }, [editAllowed, currentUpdateCycle]);

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

        let type = req === "IMAGE_UPDATE" ? "IMAGE" : "PDF";
        props.uploadFile(
          apiUrl,
          reportType,
          props.currentReportId,
          rowId,
          localData,
          type,
          newKey,
          isSuccess
        );
        break;
      default:
        props.updateFieldData(
          apiUrl,
          reportType,
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
  let handleNewFilterData = (filterData, logic) => {
    console.log("HANDLE NEW FILTER DATA", filterData, logic);
    let newFilter = new URLSearchParams();
    const { data } = filterData;

    if (data == null) return;

    for (let i = 0; i < (filterData.idsArr?.length || 0); i++) {
      let filtName = filterData.idsArr[i];
      newFilter.append(
        "filters",
        data[filtName + "FV"] + data[filtName + "SV"] + data[filtName + ""]
      );
    }
    if (
      newFilter.toString() !== queryParams.filters.toString() ||
      logic != queryParams.filterLogic
    ) {
      let newQueryParams = {
        ...queryParams,
        pageNumber: 0,
        isNewKey: true,
        filters: newFilter,
        filterLogic: logic,
      };
      setQueryParams(newQueryParams);
      if (props.updateQueryParams) props.updateQueryParams(newQueryParams);
    }
  };
  const handleSearch = (searchValue) => {
    let newQueryParams = {
      ...queryParams,
      pageNumber: 0,
      isNewKey: true,
      search: searchValue || "",
    };
    setQueryParams(newQueryParams);
    if (props.updateQueryParams) props.updateQueryParams(newQueryParams);
  };

  const handleDateRange = (dateRange) => {
    let newQueryParams = {
      ...queryParams,
      pageNumber: 0,
      isNewKey: true,
      start: dateRange.startDate,
      end: dateRange.endDate,
    };
    setQueryParams(newQueryParams);
    if (props.updateQueryParams) props.updateQueryParams(newQueryParams);
  };
  const tableActionsClicked = (id, rowId) => {
    console.log("table actions clicked", id, rowId);
    if (id === "delete")
      if (props.deleteTableContent)
        props.deleteTableContent(apiUrl, reportType, currentReportId, rowId);
  };
  let tableWidth = Object.keys(columnsWidth)
    .map((el) => columnsWidth[el])
    .reduce((a, b) => a + b, 0);
  const onScroll = () => {};
  const setScrollToEnd = () => {
    let step = 50;
    if (tableWidth <= tableWrapper.current.offsetWidth) return;
    if (intervalTimer.current != null) clearInterval(intervalTimer.current);
    intervalTimer.current = setInterval(() => {
      console.log("timer running");
      tableWrapper.current.scrollLeft += step;
      if (
        tableWrapper.current.scrollLeft >=
        tableWidth - tableWrapper.current.offsetWidth - 15
      ) {
        clearInterval(intervalTimer.current);
      }
    }, 5);
  };
  const setScrollToStart = () => {
    let step = 50;
    if (tableWidth <= tableWrapper.current.offsetWidth) return;
    if (intervalTimer.current != null) clearInterval(intervalTimer.current);
    intervalTimer.current = setInterval(() => {
      console.log("timer running");
      tableWrapper.current.scrollLeft -= step;
      if (tableWrapper.current.scrollLeft <= 15) {
        clearInterval(intervalTimer.current);
      }
    }, 5);
  };
  const freezedColumnKeys = props.freezedColumnKeys || [];
  const tableHeaderFreezed = tableHeader.filter((el) =>
    freezedColumnKeys.includes(el.key)
  );
  const cellSpecsNew = createHeaderSpecs(tableHeader);
  const cellSpecsFreezed = cellSpecsNew.filter((el) =>
    freezedColumnKeys.includes(el.key)
  );
  const getFreezedColumnWidth = () => {
    if (freezedColumnKeys.length < 1) return 0;
    return freezedColumnKeys
      .map((el) => columnsWidth[el])
      .reduce((a, b) => a + b, 0);
  };
  let disableTableStatus = {
    contentAddAble: false,
    contentEditAble: false,
    contentDeleteAble: false,
    fieldAddAble: false,
    fieldEditAble: false,
    fieldDeleteAble: false,
  };

  const updateCurrentScroll = (val) => {
    if (freezedColumnKeys.length < 1) return;
    if (!isScrolling && !tempIsScrolling.current) {
      tempIsScrolling.current = true;
      console.log("FREEZED TABLE STATE START", tempIsScrolling.current);
      setIsScrolling(true);
    }
    if (timeoutTimer.current != null) clearTimeout(timeoutTimer.current);
    timeoutTimer.current = setTimeout(() => {
      scrollTopTable.current = val;
      tempIsScrolling.current = false;
      setIsScrolling(false);
      console.log("FREEZED TABLE STATE END", tempIsScrolling.current);
    }, 400);
  };
  const showSkeletonForTableData = () => {
    return (
      (props.tableDataPending || props.tableHeaderPending) &&
      (tableData.length < 1 || tableHeader.length < 1)
    );
  };
  const showSkeletonForTableHeader = () => {
    console.log(
      "show skeleton for tableHeader",
      props.tableHeaderPending && tableHeader.length < 1
    );
    return props.tableHeaderPending && tableHeader.length < 1;
  };
  let freezedTable = (formData) => (
    <TableVirtualized
      {...{
        tableData,
        formData,
        onHeaderClicked,
        updateFieldData,
        tableActionsClicked,
      }}
      scrollTop={scrollTopTable.current}
      tableDataSkeletonPreview={isScrolling || tempIsScrolling.current}
      editAllowed={false}
      isFreezed={true}
      sortByColumn={() => {}}
      validationSchema={{}}
      tableStatus={disableTableStatus}
      tableHeader={tableHeaderFreezed}
      cellSpecs={cellSpecsFreezed}
      showCircularIndicator={false}
      rowCount={tableData.length}
      rowGetter={({ index }) => tableData[index]}
      columns={tableHeaderFreezed.map((el) => ({
        ...el,
        dataKey: el.key,
        width: columnsWidth[el.key] != null ? columnsWidth[el.key] : 100,
      }))}
    />
  );
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
        {tableData.length > 0 ? (
          <React.Fragment>
            <div className={styles.scrollButton} onClick={setScrollToEnd}>
              <FontAwesomeIcon
                className={styles.scrollIcon}
                icon={faAngleRight}
                size={"lg"}
              />
            </div>
            <div
              className={styles.scrollButton}
              style={{ left: "0vw", right: "unset" }}
              onClick={setScrollToStart}
            >
              <FontAwesomeIcon
                className={styles.scrollIcon}
                icon={faAngleLeft}
                size={"lg"}
              />
            </div>
          </React.Fragment>
        ) : null}

        <div
          style={{
            display: "flex",
            flexFlow: "column",
            height: "100vh",
            maxWidth: "100vw",
            minHeight: "600px",
          }}
        >
          {(props.tableHeader && props.tableHeader.length > 0 && !staticData) ||
          true ? (
            <div className={styles.filterHeader}>
              <div
                style={{
                  width: "100vw", //replace with tablewidth

                  maxWidth: "100vw",
                  margin: "0 auto",
                }}
              >
                <FilterHeader
                  getCurrentUpdateCycle={() => currentUpdateCycle.current}
                  queryParams={getCurrentQueryParams()}
                  totalReportItems={props.totalReportItems}
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
          <Formik
            initialValues={getInitValues()}
            enableReinitialize={true}
            validationSchema={getValidationSchemaObject()}
            onSubmit={(values, actions) => {
              console.log("values", values);
              console.log("actions", actions);
            }}
          >
            {(formData) => (
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                {freezedColumnKeys.length > 0 ? (
                  <div
                    className={styles.freezedTable}
                    style={{
                      width: getFreezedColumnWidth(),
                      height: `calc(100% - ${20}px)`,
                      maxWidth: "50vw",
                      overflow: "auto",
                    }}
                  >
                    {freezedTable(formData)}
                  </div>
                ) : null}
                <div
                  ref={tableWrapper}
                  className={styles.wrapper}
                  onScroll={onScroll}
                  style={{
                    position: "relative",
                    width: `calc(100% - ${0})`,
                    height: "100%",
                    marginLeft: 0 + "px",
                  }}
                >
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
                    {(props.serverError && props.serverError.length > 0) ===
                    true ? (
                      <InfoDialog
                        open={
                          (props.serverError &&
                            props.serverError.length > 0) === true
                        }
                        icon={faExclamationCircle}
                        handleClose={() => props.removeError()}
                        buttonTitle={"Okay"}
                        content={props.serverError}
                        title={"Sorry"}
                      />
                    ) : null}

                    {
                      // props.tableHeaderPending ? (
                      //   <div
                      //     style={{
                      //       width: staticData ? "500px" : "100vw",
                      //       height: "100%",

                      //       display: "flex",
                      //       justifyContent: "center",
                      //       alignItems: "center",
                      //     }}
                      //   >
                      //     {props.tableDataPending ? (
                      //       <Loader
                      //         type="ThreeDots"
                      //         color="#00BFFF"
                      //         height={50}
                      //         width={50}
                      //         timeout={0} //3 secs
                      //       />
                      //     ) : (
                      //       <h4 className={styles.noData}>No Record Found</h4>
                      //     )}
                      //   </div>
                      // ) :
                      <InfiniteLoader
                        editAllowed={editAllowed}
                        isNextPageLoading={props.tableDataPending}
                        loadNextPage={loadMoreItems}
                        tableHeaderSkeletonPreview={false}
                        tableDataSkeletonPreview={false}
                        tableData={
                          showSkeletonForTableData() || props.tableDataPending
                            ? getDummyTableData()
                            : props.tableData
                        }
                        tableHeader={
                          showSkeletonForTableHeader()
                            ? dummyTableHeader
                            : tableHeader
                        }
                        cellSpecs={createHeaderSpecs(tableHeader)}
                        formData={formData}
                        totalReportItems={props.totalReportItems}
                        columnsWidth={
                          props.tableHeaderPending
                            ? dummyColumnWidth
                            : columnsWidth
                        }
                        validationSchema={createValidationSchema()}
                        sortByColumn={queryParams}
                        onHeaderClicked={onHeaderClicked}
                        updateFieldData={updateFieldData}
                        freezedColumnKeys={props.freezedColumnKeys || []}
                        tableActionsClicked={tableActionsClicked}
                        updateCurrentScroll={updateCurrentScroll}
                        currentReportId={currentReportId}
                        apiUrl={apiUrl}
                        reportType={reportType}
                        bearerToken={props.bearerToken}
                        tableStatus={{
                          contentAddAble,
                          contentEditAble,
                          contentDeleteAble,
                          fieldAddAble,
                          fieldEditAble,
                          fieldDeleteAble,
                        }}
                      />
                    }
                  </Paper>
                </div>
              </div>
            )}
          </Formik>
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
