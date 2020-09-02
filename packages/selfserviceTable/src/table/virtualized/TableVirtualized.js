import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";

import { AutoSizer, Column, Table } from "react-virtualized";
import SingleTableHeader from "../tableHeader/singleTableHeader/SingleTableHeader";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import * as Constants from "../constants/Constants";
import TableDialog from "../../common/tableDialog/TableDialog";
import Skeleton from "@material-ui/lab/Skeleton";
import "react-virtualized/styles.css";
import "./TableVirtualized.scss";
import isEqual from "lodash.isequal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },

  table: {
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
    "&:nth-of-type(odd)": {
      background: "#F9FAFF",
    },
  },

  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    padding: 0,
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
});

const VirtualizedTable = React.forwardRef((props, ref) => {
  // const [scrollIndex, setScrollIndex] = useState(0);

  let defaultProps = {
    headerHeight: Constants.tableHeaderHeight,
    rowHeight: Constants.tableRowHeight,
  };

  const scrollTopTable = useRef(null);
  const {
    apiUrl,
    reportType,
    classes,
    columns,
    rowHeight,
    headerHeight,
    onRowsRendered,
    showCircularIndicator,
    tableData,
    onHeaderClicked,
    sortByColumn,
    formData,
    isFreezed,
    updateCurrentScroll,
    tableHeaderSkeletonPreview,
    tableDataSkeletonPreview,
    currentReportId,

    ...tableProps
  } = props;

  const getKey = (tableDataId, fieldKey) => {
    return tableDataId + fieldKey;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (updateCurrentScroll != null && event.ctrlKey)
        updateCurrentScroll(scrollTopTable.current);
    };

    window.addEventListener("keydown", handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateCurrentScroll]);
  const getInitData = (el) => {
    if (el.type === "CONTACT") {
      let cell = columns.find((el) => el.type === "CONTACT");

      if (cell.value) return cell.value;
      else return {};
    }
    return el.type === "IMAGE" || el.type === "DATETIME" ? null : "";
  };
  const cellRenderer = ({ dataKey, rowData }) => {
    let currentValue = rowData[dataKey];

    if (currentValue === "%%SKELETON_PREVIEW%%") {
      return <Skeleton style={{ width: "8vw" }} />;
    }
    const {
      handleChange,
      handleSubmit,
      handleBlur,
      setFieldValue,
      setFieldTouched,
      setFieldError,
    } = {
      ...props.formData,
    };

    let { validationSchema, tableActionsClicked } = { ...props };
    if (!validationSchema) validationSchema = {};

    const { cellSpecs, updateFieldData, onlyDiv } = { ...props };
    const formData = props.formData;
    const { classes, rowHeight, onRowClick } = props;
    const myCell = cellSpecs.find((el) => el.key === dataKey);
    const columnItem = columns.find((el) => el.key === dataKey);
    if (myCell.isIcon || !myCell.type || onlyDiv)
      return <div style={{ width: "100%", height: "100%" }}></div>;

    const tableCell = (
      <MyTableCell
        editAllowed={props.editAllowed}
        myKey={getKey(rowData.id, myCell.key)}
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        rowWidth={columnItem && columnItem.width ? columnItem.width : 150}
        rowHeight={rowHeight}
        serverData={{ ...myCell.data }}
        tableActionsClicked={tableActionsClicked}
        apiUrl={apiUrl}
        reportType={reportType}
        bearerToken={Constants.bearerToken}
        handlerFunctions={{
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          setFieldError,
        }}
        rowData={rowData}
        cellOriginalKey={myCell.key}
        updateFieldData={updateFieldData}
        appSchemaObj={validationSchema}
        appErrorObj={formData.errors}
        appTouchedObj={formData.touched}
        item={{
          name: getKey(rowData.id, myCell.key),
          value:
            formData.values[getKey(rowData.id, myCell.key)] ||
            getInitData(myCell),

          fallbackValue: (rowData.data || {})[myCell.key],
          error: formData.errors
            ? formData.errors[getKey(rowData.id, myCell.key)]
            : null,
          touched: formData.touched
            ? formData.touched[getKey(rowData.id, myCell.key)] === true
            : false,
          validationSchema: validationSchema[getKey(rowData.id, myCell.key)],
          type: myCell.type,
        }}
      />
    );
    return myCell.type === "ITEM_LIST" ? (
      <TableDialog
        editAllowed={props.editAllowed || true}
        {...{ ...myCell.data, value: undefined }}
        value={
          formData.values[getKey(rowData.id, myCell.key)] || getInitData(myCell)
        }
      >
        {tableCell}
      </TableDialog>
    ) : (
      tableCell
    );
  };

  const headerRenderer = (headerData) => {
    if (headerData.skeletonPreview === "%%SKELETON_PREVIEW%%") {
      return <Skeleton style={{ width: "8vw" }} />;
    }

    const { label, onHeaderClicked, dataKey, sortByColumn } = headerData;
    const { classes, cellSpecs, tableStatus } = props;
    let myCell = cellSpecs.find((el) => el.key === dataKey);

    return (
      <SingleTableHeader
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        currentReportId={currentReportId}
        apiUrl={apiUrl}
        token={Constants.bearerToken}
        style={
          sortByColumn.key === dataKey ? { backgroundColor: "yellow" } : {}
        }
        onlyView={
          myCell &&
          (myCell.key === "indexIdNumber" || myCell.key === "createAt")
        }
        tableStatus={tableStatus}
        cellSpecs={{ ...myCell, ...myCell.data }}
        label={label}
        sortOrder={sortByColumn.key === dataKey ? sortByColumn.order : null}
        // onClick={(e) => onHeaderClicked(dataKey)}
        onItemSelect={(option) => onHeaderClicked(dataKey, option)}
      />
    );
  };
  const getRowClassName = ({ index }) => {
    const { classes, onRowClick } = props;
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };
  const getColumnsWidth = (columnsList) => {
    return columnsList.map((el) => el.width || 150).reduce((a, b) => a + b, 0);
  };
  // const setScrollToTop = () => {
  //   setScrollIndex(0);
  // };

  // const setScrollToBottom = () => {
  //   console.log("setting scroll index", tableData.length);
  //   let tableScroll = tableData.length - 10;
  //   if (tableScroll > 0) setScrollIndex(tableScroll);
  // };
  let tableClasses = [classes.table];
  if (isFreezed) tableClasses.push("freezedTable");
  const onScrollTable = (event) => {
    scrollTopTable.current = event.scrollTop;
  };
  return (
    <React.Fragment>
      {/* <div className={"scrollButtonTableVirtual"}>
        <div onClick={setScrollToTop} style={{ marginBottom: "3px" }}>
          <FontAwesomeIcon
            className={styles.scrollIcon}
            icon={faAngleUp}
            size={"lg"}
          />
        </div>
        <div onClick={setScrollToBottom}>
          <FontAwesomeIcon
            className={styles.scrollIcon}
            icon={faAngleDown}
            size={"lg"}
          />
        </div>
      </div> */}

      <AutoSizer>
        {({ height, width }) => (
          <Table
            scrollTop={props.scrollTop ? props.scrollTop : undefined}
            height={height}
            width={getColumnsWidth(columns)}
            rowHeight={rowHeight || defaultProps.rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            onScroll={onScrollTable}
            headerHeight={headerHeight || defaultProps.headerHeight}
            className={tableClasses.join(" ")}
            onRowsRendered={onRowsRendered}
            noRowsRenderer={() => (
              <div className="no-data">
                {tableData.length > 0 ? <div></div> : "No data found"}
              </div>
            )}
            ref={ref}
            {...tableProps}
            rowClassName={getRowClassName}
          >
            {columns.map(
              ({ key: dataKey, skeletonPreview, ...other }, index) => {
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={(headerProps) =>
                      headerRenderer({
                        ...headerProps,

                        columnIndex: index,
                        onHeaderClicked,
                        sortByColumn,
                        skeletonPreview,
                      })
                    }
                    className={clsx(classes.flexContainer)}
                    cellRenderer={cellRenderer}
                    dataKey={dataKey}
                    {...other}
                  />
                );
              }
            )}
          </Table>
        )}
      </AutoSizer>
    </React.Fragment>
  );
});
const isFormDataEqual = (obj1, obj2) => {
  return (
    equalObj(obj1.values, obj2.values, 1) &&
    equalObj(obj1.errors, obj2.errors, 2) &&
    equalObj(obj1.touched, obj2.touched, 3)
    //  &&
    // equalObj(obj2.values, obj1.values, 4) &&
    // equalObj(obj2.errors, obj1.errors, 5) &&
    // equalObj(obj2.touched, obj1.touched, 6)
  );
};
const equalObj = (val1, val2, id) => {
  let status = isEqual(val1, val2);
  console.log(id, status);
  return status;
};
const areEqual = (prevProps, nextProps) => {
  console.log("CHECKING EQUALITY");

  let status =
    isEqual(prevProps["editAllowed"], nextProps["editAllowed"]) &&
    isEqual(prevProps["tableData"], nextProps["tableData"]) &&
    isEqual(prevProps["tableHeader"], nextProps["tableHeader"]) &&
    // isEqual(
    //   prevProps["tableHeaderSkeletonPreview"],
    //   nextProps["tableHeaderSkeletonPreview"]
    // ) &&
    // isEqual(
    //   prevProps["tableDataSkeletonPreview"],
    //   nextProps["tableDataSkeletonPreview"]
    // ) &&
    isFormDataEqual(prevProps["formData"], nextProps["formData"]);

  console.log("TABLE VIRTUALIZED EQUALITY", status);
  return status;
};
VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

export default withStyles(styles)(React.memo(VirtualizedTable, areEqual));
