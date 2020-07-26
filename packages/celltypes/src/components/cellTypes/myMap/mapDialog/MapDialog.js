import React, { useState } from "react";
import GoogleMaps from "./googleMap/GoogleMaps";
import styles from "./MapDialog.module.scss";
import CryptoJS from "crypto-js";
import InputIcon from "../../../common/HOC/inputIcon/InputIcon";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MapDialog = ({ apiKey: mApiKey, handleSearch, onClose, value }) => {
  const [searchValue, setSearchValue] = useState("");
  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      if (handleSearch) handleSearch(searchValue);
    }
  };
  const mapStyles = {
    width: "650px",
    height: "550px",
  };
  const decryptKey = (apiKey) => {
    if (!apiKey) {
      console.log("no key found");
      return;
    }
    const SHA = CryptoJS.SHA1("dummydummy");
    SHA.sigBytes = 16;
    var bytes = CryptoJS.AES.decrypt(apiKey, SHA, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("original key is", originalText, "prev key is", apiKey);
    return originalText;
  };
  const apiKey = decryptKey(mApiKey);
  return (
    <div>
      <div className={styles.headerWrapper}>
        <InputIcon icon={faSearch}>
          <input
            className={styles.input}
            placeholder="Search"
            value={searchValue}
            onKeyDown={handleKeydown}
            onChange={(e) => {
              let val = e.currentTarget.value;
              if ((!val || val === "") && val !== searchValue && handleSearch)
                handleSearch(val);
              setSearchValue(e.currentTarget.value);
            }}
          />
        </InputIcon>

        <div>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={onClose}
            className={styles.icon}
          />
        </div>
      </div>

      <GoogleMaps value={value} customStyles={mapStyles} apiKey={apiKey} />
    </div>
  );
};
export default MapDialog;
