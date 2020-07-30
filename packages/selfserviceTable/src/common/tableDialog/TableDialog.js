import React from "react";
import { Dialog, makeStyles } from "@material-ui/core";
import TableCreator from "../../table/tableCreator/TableCreator";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const TableData = ({ value: mValue, fields }) => {
  let value = mValue || {};
  let items = value.items || [];
  console.log("value is", value, "fields is", fields);
  const tableData = items.map((el, index) => {
    return {
      id: index,
      data: { ...el },
    };
  });
  const tableHeader = fields;
  console.log(
    "In dialog : table data is",
    tableData,
    "table header is",
    fields
  );
  return (
    <TableCreator
      tableHeader={fields}
      tableData={tableData}
      tableHeader={tableHeader}
      editAllowed={false}
      staticData={true}
    />
  );
};
const TableDialog = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = (event) => {
    console.log("setting open to true");
    if (!props.editAllowed) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const id = open ? "simple-popover" : undefined;
  return (
    <React.Fragment>
      <div onClick={handleClick}>{props.children}</div>
      <Dialog
        title={"Details"}
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
      >
        <TableData {...props} />
      </Dialog>
    </React.Fragment>
  );
};
export default TableDialog;
