import React, { useState } from "react";
import styles from "./SingleTableHeader.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import TableCell from "@material-ui/core/TableCell";
import TableHeaderSettings from "../tableHeaderSettingsDropdown/TableHeaderSettingsDropdown";
const SingleTableHeader = (props) => {
  return (
    <TableHeaderSettings>
      <TableCell
        component="div"
        variant="head"
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
        </div>
        <div></div>
      </TableCell>
    </TableHeaderSettings>
  );
};
export default SingleTableHeader;
