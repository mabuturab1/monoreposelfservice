import React from "react";
import styles from "./SingleTableHeader.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import TableCell from "@material-ui/core/TableCell";
const SingleTableHeader = (props) => {
  return (
    <TableCell
      component="div"
      variant="head"
      className={props.className}
      onClick={props.onClick}
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
    </TableCell>
  );
};
export default SingleTableHeader;
