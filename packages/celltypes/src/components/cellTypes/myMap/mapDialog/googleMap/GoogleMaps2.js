import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GoogleMaps.module.scss";
import Autocomplete from "react-google-autocomplete";
import InputIcon from "../../../../common/HOC/inputIcon/InputIcon";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { CircularProgress } from "@material-ui/core";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";

const GoogleMaps = (props) => {
  const [mapData, setMapData] = useState({
    address: "",
    city: "",
    area: "",
    mapData: "",
    mapPosition: {
      lat: -1.2884,
      lng: 36.8233,
    },
    markerPosition: {
      lat: -1.2884,
      lng: 36.8233,
    },
  });
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
  const onMarkerDragEnd = (data) => {};
  const onInfoWindowClose = (data) => {};
  const AsyncMap = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        google={props.google}
        defaultZoom={props.zoom}
        defaultCenter={{
          lat: mapData.mapPosition.lat,
          lng: mapData.mapPosition.lng,
        }}
      >
        {/* For Auto complete Search Box */}
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
        {/*Marker*/}
        <Marker
          google={props.google}
          name={"Dolores park"}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          position={{
            lat: mapData.markerPosition.lat,
            lng: mapData.markerPosition.lng,
          }}
        />
        <Marker />
        {/* InfoWindow on top of marker */}
        <InfoWindow
          onClose={onInfoWindowClose}
          position={{
            lat: mapData.markerPosition.lat + 0.0018,
            lng: mapData.markerPosition.lng,
          }}
        >
          <div>
            <span style={{ padding: 0, margin: 0 }}>{mapData.address}</span>
          </div>
        </InfoWindow>
      </GoogleMap>
    ))
  );
  return (
    <div style={props.customStyles}>
      <AsyncMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: 550 }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};
export default GoogleMaps;
