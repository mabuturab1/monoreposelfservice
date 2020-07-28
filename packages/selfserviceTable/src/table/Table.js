import React from "react";
import TableCreatorWrapper from "./tableCreator/TableCreatorWrapper";
import SnackbarStatus from "./snackbarStatus/SnackbarStatus";
import styles from "./Table.module.scss";
const MyTable = (props) => {
  return (
    <div className={styles.selfServiceTableWrapper}>
      <SnackbarStatus />
      <TableCreatorWrapper {...props} />
    </div>
  );
};

export default MyTable;
