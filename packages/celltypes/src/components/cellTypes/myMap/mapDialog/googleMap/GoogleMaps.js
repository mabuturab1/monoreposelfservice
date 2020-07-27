import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GoogleMaps.module.scss";
import InputIcon from "../../../../common/HOC/inputIcon/InputIcon";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
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
  const markerPositionRef = useRef({
    lat: value && value.lat ? value.lat : -1.2884,
    lng: value && value.long ? value.long : 36.8233,
  });
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
          markerPositionRef.current = {
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
    address: "",
    area: "",
    city: "",
    state: "",
    markerPosition: {
      lat: value && value.lat ? value.lat : -1.2884,
      lng: value && value.long ? value.long : 36.8233,
    },
    mapPosition: {
      lat: value && value.lat ? value.lat : -1.2884,
      lng: value && value.long ? value.long : 36.8233,
    },
  });
  const mapStyles = {
    width: "550px",
    height: "550px",
  };

  const moveMarker = (data1, data2, coord) => {
    console.log(data1, data2);
    if (coord && coord.latLng) {
      console.log(coord.latLng.lat(), coord.latLng.lng());
      // setMapData({
      //   ...mapData,
      //   markerPosition: {
      //     lat: coord.latLng.lat(),
      //     lng: coord.latLng.lng(),
      //   },
      // });
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
    if (center)
      setMapData({
        ...mapData,
        mapPosition: {
          lat: center.lat(),
          lng: center.lng(),
        },
      });
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
          onDragend={(data1, data2) => onMapsDragEnd(data2)}
          center={{
            lat: mapData.mapPosition.lat,
            lng: mapData.mapPosition.lng,
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
