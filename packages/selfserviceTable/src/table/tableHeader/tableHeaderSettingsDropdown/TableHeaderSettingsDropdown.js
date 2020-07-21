import React, { useRef } from "react";
import StyledMenuList from "../../../common/menuList/MenuList";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import GridOnIcon from "@material-ui/icons/GridOn";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
const TableHeaderSettings = (props) => {
  const headerData = useRef([
    {
      headerTitle: "Order",
      options: [
        {
          text: "UnSort",
          icon:
            props.sort == null || props.sort == "Unsort" ? (
              <CheckIcon style={{ color: "#000000" }} fontSize="small" />
            ) : undefined,
        },
        {
          text: "Ascending",
          icon:
            props.sort && props.sort == "Ascending" ? (
              <CheckIcon style={{ color: "#000000" }} fontSize="small" />
            ) : undefined,
        },
        {
          text: "Descending",
          icon:
            props.sort && props.sort == "Descending" ? (
              <CheckIcon style={{ color: "#000000" }} fontSize="small" />
            ) : undefined,
        },
      ],
    },
    {
      headerTitle: "Settings",
      options: [
        {
          text: "Freeze",
          icon: (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  top: 0,
                  left: "-4px",
                  width: "11px",
                  height: "11px",
                  fontSize: "12px",
                }}
              >
                <AcUnitIcon
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    fontSize: "inherit",
                    color: "#5CAEE5",
                  }}
                />
              </div>
              <GridOnIcon style={{ color: "#000000" }} fontSize="small" />
            </div>
          ),
        },
        { text: "Edit", icon: <EditIcon fontSize="small" /> },
        { text: "Delete", icon: <DeleteOutlineIcon fontSize="small" /> },
      ],
    },
  ]);
  const handleItemClicked = (i, j) => {
    console.log(i, j);
    const section = headerData.current[i];
    let item = null;
    if (section) item = section.options[j];
    console.log("item clicked is", item);
  };
  return (
    <StyledMenuList
      itemClicked={handleItemClicked}
      trigger={props.children}
      headerStyle={{ color: "#D6D6D6", fontSize: "22px" }}
      data={headerData.current}
    />
  );
};
export default TableHeaderSettings;
