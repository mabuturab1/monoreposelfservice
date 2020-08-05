import React, { useState } from "react";
import StyledMenuList from "../../../common/menuList/MenuList";
import * as actions from "../../../store/actions";
import GridOnIcon from "@material-ui/icons/GridOn";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import CellEditDialog from "../../../common/cellEditDialog/cellEditDialog";
import ConfirmationDialog from "../../../common/confirmationDialog/ConfirmationDialog";
import { connect } from "react-redux";
const TableHeaderSettings = (props) => {
  const isNewField = Object.keys(props.cellSpecs).length < 1;
  let fieldDeleteAble = false;
  let fieldEditAble = false;
  if (props.tableStatus) {
    fieldEditAble = props.tableStatus.fieldEditAble;
    fieldDeleteAble = props.tableStatus.fieldDeleteAble;
  }
  const { apiUrl, currentReportId } = props;
  const [currentSelection, setCurrentSelection] = useState("");
  const [currentSortOrder, setCurrentSortOrder] = useState(props.sortOrder);
  const headerData = [
    {
      headerTitle: "Order",
      options: [
        {
          id: "unsorted",
          text: "Unsort",
          icon:
            currentSortOrder === null || currentSortOrder === "unsorted" ? (
              <CheckIcon style={{ color: "#5CAEE5" }} fontSize="small" />
            ) : undefined,
        },
        {
          id: "ASC",
          text: "Ascending",
          icon:
            currentSortOrder && currentSortOrder === "ASC" ? (
              <CheckIcon style={{ color: "#5CAEE5" }} fontSize="small" />
            ) : undefined,
        },
        {
          id: "DESC",
          text: "Descending",
          icon:
            currentSortOrder && currentSortOrder === "DESC" ? (
              <CheckIcon style={{ color: "#5CAEE5" }} fontSize="small" />
            ) : undefined,
        },
      ],
    },
    {
      headerTitle: "Settings",
      options: [
        {
          id: "freeze",
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
      ],
    },
  ];
  if (fieldEditAble !== false) {
    headerData[1].options.push({
      id: "edit",
      text: "Edit",
      icon: <EditIcon style={{ color: "#4A4A4A" }} fontSize="small" />,
      closeRequired: true,
    });
  }
  if (fieldDeleteAble !== false)
    headerData[1].options.push({
      id: "delete",
      text: "Delete",
      type: "red",
      icon: <DeleteOutlineIcon style={{ color: "#FF6060" }} fontSize="small" />,
    });
  const isSortOrder = (data) => {
    if (data === "unsorted" || data === "ASC" || data === "DESC") return true;
    else return false;
  };

  const handleItemClicked = (i, j) => {
    const section = headerData[i];
    let item = null;
    if (section) item = section.options[j];
    if (!item || !item.id) return;
    setCurrentSelection(item.id);
    if (i === 0 && item && isSortOrder(item.id)) setCurrentSortOrder(item.id);
    setTimeout(() => props.onItemSelect(item.id));
  };
  const handleSubmitData = (values, isSuccess) => {
    console.log("changed values are", values);
    if (isNewField && props.addTableField) {
      props.addTableField(apiUrl, currentReportId, values, isSuccess);
      return;
    }
    if (!isNewField && props.editTableField && props.cellSpecs.key)
      props.editTableField(
        apiUrl,
        currentReportId,
        props.cellSpecs.key,
        values,
        isSuccess
      );
  };
  const handleConfirmationResult = (response, currentSelection) => {
    let selection = currentSelection;
    if (
      response &&
      selection === "delete" &&
      props.deleteTableField &&
      props.cellSpecs.key
    )
      props.deleteTableField(apiUrl, currentReportId, props.cellSpecs.key);
  };
  const isMenuOpened = (status) => {
    if (props.isMenuOpened)
      props.isMenuOpened(status || currentSelection === "edit");
  };
  const closeEditDialog = () => {
    setCurrentSelection("");
    isMenuOpened(false);
  };
  return (
    <React.Fragment>
      {!props.defaultSelection ? (
        <StyledMenuList
          itemActiveStatus={isMenuOpened}
          itemClicked={handleItemClicked}
          trigger={props.children}
          headerStyle={{ color: "#D6D6D6", fontSize: "22px" }}
          data={headerData}
        />
      ) : null}
      {props.defaultSelection ? (
        <div onClick={() => setCurrentSelection(props.defaultSelection)}>
          {props.children}
        </div>
      ) : null}
      <CellEditDialog
        ref={props.currentTarget}
        onDialogClosed={closeEditDialog}
        onSubmitData={handleSubmitData}
        openAllowed={currentSelection === "edit"}
        cellSpecs={{ ...props.cellSpecs, ...props.cellSpecs.data }}
      />
      <ConfirmationDialog
        onDialogClosed={() => setCurrentSelection("")}
        handleResponse={(response) =>
          handleConfirmationResult(response, currentSelection)
        }
        title={"Delete Field"}
        summary={`Are you sure you want to delete ${
          props.cellSpecs ? props.cellSpecs.label : ""
        }`}
        open={currentSelection === "delete"}
        cellSpecs={{ ...props.cellSpecs, ...props.cellSpecs.data }}
      />
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    currentReportId: state.currentReportId,
    apiUrl: state.apiAddress,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteTableField: (apiUrl, currentReportId, fieldKey) =>
      dispatch(actions.deleteTableField(apiUrl, currentReportId, fieldKey)),
    updateFieldData: (apiUrl, currentReportId, fieldKey, data) =>
      dispatch(
        actions.updateFieldData(apiUrl, currentReportId, fieldKey, data)
      ),
    editTableField: (apiUrl, currentReportId, fieldKey, data, isSuccess) =>
      dispatch(
        actions.editTableField(
          apiUrl,
          currentReportId,
          fieldKey,
          data,
          isSuccess
        )
      ),
    addTableField: (apiUrl, currentReportId, data, isSuccess) =>
      dispatch(actions.addTableField(apiUrl, currentReportId, data, isSuccess)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TableHeaderSettings));
