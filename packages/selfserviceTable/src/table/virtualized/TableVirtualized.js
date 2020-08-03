import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";

import { AutoSizer, Column, Table } from "react-virtualized";
import SingleTableHeader from "../tableHeader/singleTableHeader/SingleTableHeader";
import MyTableCell from "@selfservicetable/celltypes/src/App";
import * as Constants from "../constants/Constants";
import TableDialog from "../../common/tableDialog/TableDialog";
import "react-virtualized/styles.css";
import "./TableVirtualized.scss";
import TableContext from "../context/TableContext";
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
  const tableContext = useContext(TableContext);
  let defaultProps = {
    headerHeight: Constants.tableHeaderHeight,
    rowHeight: Constants.tableRowHeight,
  };
  console.log("In table virtualized", props.scrollTop, props.onScroll);
  const {
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

    ...tableProps
  } = props;
  const getKey = (tableDataId, fieldKey) => {
    return tableDataId + fieldKey;
  };
  const getInitData = (el) => {
    if (el.type === "CONTACT") {
      let cell = columns.find((el) => el.type === "CONTACT");

      if (cell.value) return cell.value;
      else return {};
    }
    return el.type === "IMAGE" || el.type === "DATETIME" ? null : "";
  };
  const cellRenderer = ({ dataKey, rowData }) => {
    const {
      handleChange,
      handleSubmit,
      handleBlur,
      setFieldValue,
      setFieldTouched,
    } = {
      ...props.formData,
    };

    let { validationSchema, tableActionsClicked } = { ...props };
    if (!validationSchema) validationSchema = {};

    const { cellSpecs, updateFieldData } = { ...props };
    const formData = props.formData;
    const { classes, rowHeight, onRowClick } = props;
    const myCell = cellSpecs.find((el) => el.key === dataKey);
    const columnItem = columns.find((el) => el.key === dataKey);
    if (myCell.isIcon || !myCell.type)
      return <div style={{ width: "100%", height: "100%" }}></div>;

    const tableCell = (
      <MyTableCell
        editAllowed={tableContext.editAllowed}
        myKey={getKey(rowData.id, myCell.key)}
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        rowWidth={columnItem && columnItem.width ? columnItem.width : 150}
        rowHeight={rowHeight}
        serverData={{ ...myCell.data }}
        tableActionsClicked={tableActionsClicked}
        handlerFunctions={{
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          setFieldTouched,
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
        editAllowed={tableContext.editAllowed}
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
        style={
          sortByColumn.key === dataKey ? { backgroundColor: "yellow" } : {}
        }
        onlyView={
          myCell && (myCell.key === "indexIdNumber" || myCell.key === "actions")
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

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          height={height}
          width={getColumnsWidth(columns)}
          scrollTop={props.scrollTop ? props.scrollTop : undefined}
          onScroll={props.onScroll ? props.onScroll : undefined}
          rowHeight={rowHeight || defaultProps.rowHeight}
          gridStyle={{
            direction: "inherit",
          }}
          headerHeight={headerHeight || defaultProps.headerHeight}
          className={classes.table}
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
          {columns.map(({ key: dataKey, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={(headerProps) =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index,
                    onHeaderClicked,
                    sortByColumn,
                  })
                }
                className={clsx(classes.flexContainer)}
                cellRenderer={cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
});
const isFormDataEqual = (obj1, obj2) => {
  return (
    equalObj(obj1.values, obj2.values, 1) &&
    equalObj(obj1.errors, obj2.errors, 2) &&
    equalObj(obj1.touched, obj2.touched, 3) &&
    equalObj(obj2.values, obj1.values, 4) &&
    equalObj(obj2.errors, obj1.errors, 5) &&
    equalObj(obj2.touched, obj1.touched, 6)
  );
};
const equalObj = (val1, val2, id) => {
  return Object.keys(val1).filter((el) => val1[el] !== val2[el]).length === 0;
};
const areEqual = (prevProps, nextProps) => {
  let status =
    prevProps["tableData"] === nextProps["tableData"] &&
    prevProps["tableHeader"] === nextProps["tableHeader"] &&
    (!nextProps["scrollTop"] ||
      nextProps["scrollTop"] === prevProps["scrollTop"]) &&
    isFormDataEqual(prevProps["formData"], nextProps["formData"]);

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
