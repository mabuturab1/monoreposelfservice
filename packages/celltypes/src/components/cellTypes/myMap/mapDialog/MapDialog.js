import React, { useState } from "react";
import GoogleMaps from "./googleMap/GoogleMaps";
import styles from "./MapDialog.module.scss";
import CryptoJS from "crypto-js";
import InputIcon from "../../../common/HOC/inputIcon/InputIcon";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MapDialog = ({
  apiKey: mApiKey,
  handleSearch,
  onClose,
  onSubmit,
  value,
}) => {
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
  const containerStyles = {
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

    return originalText;
  };
  const onSaveLocation = (data) => {
    onSubmit(data);
  };
  const apiKey = decryptKey(mApiKey);
  return (
    <div>
      <GoogleMaps
        value={value}
        customStyles={mapStyles}
        containerStyles={containerStyles}
        apiKey={apiKey}
        onClose={onClose}
        onSave={onSaveLocation}
      />
    </div>
  );
};
export default MapDialog;
