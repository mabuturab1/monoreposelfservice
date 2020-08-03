import React from "react";
import { Dialog, makeStyles } from "@material-ui/core";
import TableCreator from "../../table/tableCreator/TableCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "10px",
  },
}));
const TableData = ({ value: mValue, fields, onClose }) => {
  let value = mValue || {};
  let items = value.items || [];
  console.log("value is", value, "fields is", fields);
  const tableData = items.map((el, index) => {
    return {
      id: index,
      data: { ...el },
    };
  });

  console.log(
    "In dialog : table data is",
    tableData,
    "table header is",
    fields
  );
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          icon={faTimes}
          onClick={onClose}
        />
      </div>

      <TableCreator
        tableHeader={fields}
        tableData={tableData}
        editAllowed={false}
        staticData={true}
        editAllowed={false}
        contentAddAble={false}
        contentEditAble={false}
        contentDeleteAble={false}
        fieldAddAble={false}
        fieldEditAble={false}
        fieldDeleteAble={false}
      />
    </React.Fragment>
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
        <TableData {...props} onClose={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};
export default TableDialog;
