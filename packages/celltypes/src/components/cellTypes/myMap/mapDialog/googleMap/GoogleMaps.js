import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GoogleMaps.module.scss";
import Autocomplete from "react-google-autocomplete";
import InputIcon from "../../../../common/HOC/inputIcon/InputIcon";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { CircularProgress } from "@material-ui/core";

const GoogleMaps = ({ google, customStyles, value, apKey }) => {
  const getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  const getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  const getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  const onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = getCity(addressArray),
      area = getArea(addressArray),
      state = getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    setMapData({
      ...mapData,
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  useEffect(() => {}, []);

  const [mapData, setMapData] = useState({
    lat: value && value.lat ? value.lat : -1.2884,
    lng: value && value.long ? value.long : 36.8233,
    address: "",
    area: "",
    city: "",
    state: "",
    markerPosition: {},
    mapPosition: {},
  });
  const mapStyles = {
    width: "550px",
    height: "550px",
  };
  console.log(value, value.lat, value.long);
  return (
    <div>
      <div></div>
      <div className={styles.mapWrapper} style={customStyles}>
        <Map
          google={google}
          zoom={14}
          style={customStyles}
          initialCenter={{
            lat: mapData.lat,
            lng: mapData.lng,
          }}
        >
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "100px",
            }}
            onPlaceSelected={onPlaceSelected}
            types={["(regions)"]}
          />
        </Map>
      </div>
    </div>
  );
};
const LoadingContainer = () => {
  return (
    <div
      style={{
        width: "650px",
        height: "550px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};
export default GoogleApiWrapper((props) => ({
  apiKey: props.apiKey,
  LoadingContainer: LoadingContainer,
}))(GoogleMaps);
