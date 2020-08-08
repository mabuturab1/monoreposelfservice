import React, { useState } from "react";
import styles from "./ReadOnlyText.module.scss";
import ConfirmationDialog from "../../common/confirmationDialog/ConfirmationDialog";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const IconList = ({ tableActionsClicked, rowData }) => {
  const [currentSelection, setCurrentSelection] = useState("");
  const handleDelete = () => {
    setCurrentSelection("delete");
  };
  const handleConfirmationResult = (response, selection) => {
    let rowId = rowData ? rowData.id : null;
    if (selection === "delete" && response) {
      if (tableActionsClicked) tableActionsClicked("delete", rowId);
    }
  };
  return (
    <React.Fragment>
      <div onClick={handleDelete} className={styles.icon}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </div>
      <ConfirmationDialog
        onDialogClosed={() => setCurrentSelection("")}
        handleResponse={(response) =>
          handleConfirmationResult(response, currentSelection)
        }
        title={"Delete Table Data"}
        summary={`Are you sure you want to delete `}
        open={currentSelection === "delete"}
      />
    </React.Fragment>
  );
};

export const ReadOnlyText = (props) => {
  let actionsList = null;
  const [hoverActive, setHoverActive] = useState(false);
  if (props.iconsArr) actionsList = <IconList {...props} />;
  return (
    <div
      className={styles.text}
      style={{ display: "flex", ...props.style }}
      onMouseEnter={() => setHoverActive(true)}
      onMouseLeave={() => setHoverActive(false)}
    >
      <span>{props.value}</span>
      {hoverActive ? <span>{actionsList}</span> : null}
    </div>
  );
};
export default ReadOnlyText;
