import React, { useState, useRef } from "react";
import styles from "./SingleTableHeader.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import TableCell from "@material-ui/core/TableCell";
import TableHeaderSettings from "../tableHeaderSettingsDropdown/TableHeaderSettingsDropdown";
import AddIcon from "@material-ui/icons/AddCircleOutline";
const SingleTableHeader = (props) => {
  const { cellSpecs } = props;

  const tableHeaderRef = useRef(null);
  let columnLabel = (
    <div className={styles.headerItemWrapper} style={props.style}>
      <div>
        <span>{props.label}</span>
        {props.sortOrder ? (
          <span
            className={styles.sort}
          >{`(Sorted in ${props.sortOrder})`}</span>
        ) : null}
      </div>
      <span>
        <FontAwesomeIcon
          style={{ color: "rgba(0, 0, 50, 0.21) " }}
          icon={faSort}
        />
      </span>
    </div>
  );

  const getIcon = (icon) => {
    switch (icon.toLowerCase()) {
      case "add":
        return (
          <div>
            <AddIcon fontSize="small" />
          </div>
        );
      default:
        return (
          <div>
            <AddIcon fontSize="small" />
          </div>
        );
    }
  };
  const getDefaultSelection = () => {
    if (cellSpecs && cellSpecs.icon && cellSpecs.icon.toLowerCase() === "add")
      return "edit";
    return undefined;
  };
  let tableHeader = (
    <TableCell
      component="div"
      variant="head"
      ref={tableHeaderRef}
      className={props.className}
      // onClick={props.onClick}
      style={{
        background: "#f9faff",
      }}
    >
      <div
        className={styles.tableHeader}
        style={{
          background: "#f9faff",
        }}
      >
        {cellSpecs.isIcon ? (
          <div className={styles.headerItemWrapper} style={props.style}>
            {getIcon(cellSpecs.icon)}
          </div>
        ) : (
          columnLabel
        )}
      </div>
      <div></div>
    </TableCell>
  );

  return (
    <React.Fragment>
      <TableHeaderSettings
        defaultSelection={getDefaultSelection()}
        currentTarget={tableHeaderRef}
        onItemSelect={props.onItemSelect}
        sortOrder={props.sortOrder}
        cellSpecs={
          cellSpecs && cellSpecs.dataKey === "%OPEN_NEW_FIELD_DIALOG%"
            ? { ...props.cellSpecs }
            : {}
        }
      >
        {tableHeader}
      </TableHeaderSettings>
    </React.Fragment>
  );
};
export default SingleTableHeader;
