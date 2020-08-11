import React from "react";
import { Dialog, makeStyles, DialogTitle } from "@material-ui/core";
import TableCreator from "../../table/tableCreator/TableCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./TableDialog.module.scss";
const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "0.6rem",
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

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.6rem 1.4rem",
          alignItems: "center",
        }}
      >
        <h6 className={[styles.text, styles.title].join(" ")}>
          {value.title || "Contact Details"}
        </h6>
        <FontAwesomeIcon
          style={{ cursor: "pointer", color: "#4A4A4A" }}
          icon={faTimes}
          onClick={onClose}
        />
      </div>

      <TableCreator
        tableHeader={fields}
        tableData={tableData}
        editAllowed={false}
        staticData={true}
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
