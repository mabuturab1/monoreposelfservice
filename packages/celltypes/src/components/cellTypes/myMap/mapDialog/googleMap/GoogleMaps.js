import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GoogleMaps.module.scss";
import InputIcon from "../../../../common/HOC/inputIcon/InputIcon";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import { CircularProgress, Button } from "@material-ui/core";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/index.min.css";
const GoogleMaps = ({
  google,
  customStyles,
  value,
  apiKey,
  containerStyles,
  onClose,
  onSave,
}) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const markerPositionRef = useRef({
    lat: value && value.lat ? value.lat : -1.2884,
    lng: value && value.long ? value.long : 36.8233,
  });
  const mapPositionRef = useRef({
    lat: value && value.lat ? value.lat : -1.2884,
    lng: value && value.long ? value.long : 36.8233,
  });

  const getLatLng = ({ place_id }) => {
    geocodeByPlaceId(place_id)
      .then((results) => {
        if (
          results &&
          results[0] &&
          results[0].geometry &&
          results[0].geometry.location
        ) {
          let location = results[0].geometry.location;
          markerPositionRef.current = {
            lat: location.lat(),
            lng: location.lng(),
          };
          mapPositionRef.current = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setMapData({
            ...mapData,
            mapPosition: {
              lat: location.lat(),
              lng: location.lng(),
            },
            markerPosition: {
              lat: location.lat(),
              lng: location.lng(),
            },
          });
        }
      })
      .catch((error) => console.error(error));
  };
  const onInfoWindowClose = () => {
    console.log("ON window closed");
  };
  const [mapData, setMapData] = useState({
    markerPosition: {
      lat: value && value.lat ? value.lat : -1.2884,
      lng: value && value.long ? value.long : 36.8233,
    },
    mapPosition: {
      lat: value && value.lat ? value.lat : -1.2884,
      lng: value && value.long ? value.long : 36.8233,
    },
  });

  const moveMarker = (data1, data2, coord) => {
    console.log(data1, data2);
    if (coord && coord.latLng) {
      console.log(coord.latLng.lat(), coord.latLng.lng());

      markerPositionRef.current = {
        lat: coord.latLng.lat(),
        lng: coord.latLng.lng(),
      };
    }
  };
  const marker = (
    <Marker
      draggable={true}
      onDragend={(data1, data2, data3) => moveMarker(data1, data2, data3)}
      name={"GM"}
      position={{
        lat: markerPositionRef.current.lat,
        lng: markerPositionRef.current.lng,
      }}
    />
  );

  const onMapsDragEnd = ({ center }) => {
    if (center) {
      mapPositionRef.current = {
        lat: center.lat(),
        lng: center.lng(),
      };
    }
  };
  const handleSave = (e) => {
    onSave(markerPositionRef.current);
  };
  return (
    <div>
      <div className={styles.buttonWrapper}>
        <Button
          style={{ fontSize: "12px" }}
          color="primary"
          onClick={handleSave}
        >
          Save Location
        </Button>
        <FontAwesomeIcon
          icon={faTimes}
          onClick={onClose}
          className={styles.icon}
        />
      </div>

      <div className={styles.mapWrapper} style={containerStyles}>
        <div>
          {mapsLoaded ? (
            <InputIcon icon={faSearch} absolute={true}>
              <GooglePlacesAutocomplete onSelect={(data) => getLatLng(data)} />
            </InputIcon>
          ) : null}
        </div>
        <Map
          google={google}
          zoom={14}
          onReady={() => setMapsLoaded(true)}
          style={customStyles}
          onDragend={(data1, data2) => onMapsDragEnd(data2)}
          center={{
            lat: mapPositionRef.current.lat,
            lng: mapPositionRef.current.lng,
          }}
        >
          {marker}

          <InfoWindow marker={marker} onClose={onInfoWindowClose}>
            <div>
              <h1>{"Test"}</h1>
            </div>
          </InfoWindow>
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
