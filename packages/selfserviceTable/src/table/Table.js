import React from "react";
import TableCreator from "./tableCreator/TableCreator";
import SnackbarStatus from "./snackbarStatus/SnackbarStatus";

const MyTable = (props) => {
  console.log("MY TABLE RE-RENDERED");
  return (
    <div>
      <SnackbarStatus />
      <TableCreator {...props} />
    </div>
  );
};

export default MyTable;
