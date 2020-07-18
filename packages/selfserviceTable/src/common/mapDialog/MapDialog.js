import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./MapDialog.module.scss";
const MapDialog = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      if (props.handleSearch) props.handleSearch(searchValue);
    }
  };
  return (
    <div>
      <div>
        <div style={styles.search}>
          <FontAwesomeIcon icon={faSearch} className={styles.icon} />
          <input
            className={styles.input}
            placeholder="Search"
            value={searchValue}
            onKeyDown={handleKeydown}
            onChange={(e) => {
              let val = e.currentTarget.value;
              if (
                (!val || val === "") &&
                val !== searchValue &&
                props.handleSearch
              )
                props.handleSearch(val);
              setSearchValue(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faTimes} className={styles.icon} />
        </div>
      </div>
    </div>
  );
};
export default MapDialog;
