import React from "react";
import TableCreator from "./tableCreator/TableCreator";
import SnackbarStatus from "./snackbarStatus/SnackbarStatus";
import styles from "./Table.module.scss";
const MyTable = (props) => {
  return (
    <div className={styles.selfServiceTableWrapper}>
      <SnackbarStatus />
      <TableCreator {...props} />
    </div>
  );
};

export default MyTable;
