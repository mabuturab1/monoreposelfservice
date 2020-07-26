import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GoogleMaps.module.scss";
import AutoComplete from "react-google-autocomplete";
import InputIcon from "../../../../common/HOC/inputIcon/InputIcon";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { CircularProgress } from "@material-ui/core";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/index.min.css";
const GoogleMaps = ({ google, customStyles, value, apiKey }) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);
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
  const getLatLng = ({ place_id }) => {
    geocodeByPlaceId(place_id)
      .then((results) => {
        console.log(results);
        if (
          results &&
          results[0] &&
          results[0].geometry &&
          results[0].geometry.location
        ) {
          let location = results[0].geometry.location;
          setMapData({ ...mapData, lat: location.lat(), lng: location.lng() });
        }
        console.log(
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        );
      })
      .catch((error) => console.error(error));
  };
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
  console.log("api key is", apiKey);
  console.log(value, value.lat, value.long);
  const moveMarker = (coord) => {
    console.log(coord, coord.latlng);
    if (coord && coord.latlng) {
      console.log(coord.latlng.lat(), coord.latlng.lng());
      setMapData({
        ...mapData,
        lat: coord.latlng.lat(),
        lng: coord.latlng.lng(),
      });
    }
  };
  return (
    <div>
      <div></div>
      <div className={styles.mapWrapper} style={customStyles}>
        {mapsLoaded ? (
          <GooglePlacesAutocomplete onSelect={(data) => getLatLng(data)} />
        ) : null}
        <Map
          google={google}
          zoom={14}
          onReady={() => setMapsLoaded(true)}
          style={customStyles}
          center={{
            lat: mapData.lat,
            lng: mapData.lng,
          }}
        >
          <Marker
            draggable={true}
            onDragend={(data1, data2, data3) => moveMarker(data3)}
            name={"GM"}
            position={{ lat: mapData.lat, lng: mapData.lng }}
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
