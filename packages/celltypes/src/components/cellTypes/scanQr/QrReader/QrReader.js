import React, { useState, useEffect, useRef } from "react";
// import { Uint8ClampedArray } from "typedarray";
import { Buffer } from "buffer";

import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import Webcam from "react-webcam";
import jsqr from "jsqr";
import styles from "./QrReader.module.scss";
import { Button } from "@material-ui/core";
global.Buffer = Buffer; // very important

const QrReader = ({ onClose, onSubmit }) => {
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  const webcamRef = React.useRef(null);
  const [anError, setError] = useState(false);
  const [result, setResult] = useState("");

  let interval = useRef(null);
  const decodeQr = React.useCallback(() => {
    if (webcamRef == null || webcamRef.current == null) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc == null) return;
    // const { clampedArray, width, height } = convertBase64ToRGBA(imageSrc);
    const png = PNG.sync.read(
      Buffer.from(imageSrc.slice("data:image/png;base64,".length), "base64")
    );
    const code = jsqr(Uint8ClampedArray.from(png.data), png.width, png.height);
    console.log("CODE IS", code);
    if (code != null) setResult(code);
    // const result = decodeResult(clampedArray, width, height);
    // console.log(result);
  }, [webcamRef]);
  const decodeResult = (clampedArray, width, height) => {
    return jsqr(clampedArray, width, height);
  };
  const convertBase64ToRGBA = (base64) => {
    const jpegData = Buffer.from(
      base64.slice("data:image/jpeg;base64,".length),
      "base64"
    );

    var rawImageData = jpeg.decode(jpegData);
    console.log("1 cleared");
    var clampedArray = new Uint8ClampedArray(rawImageData.data.lengt);
    console.log("2 cleared");
    console.log(clampedArray);
    var i;
    for (i = 0; i < rawImageData.data.length; i++) {
      clampedArray[i] = rawImageData.data[i];
    }
    return {
      clampedArray,
      width: rawImageData.width,
      height: rawImageData.height,
    };
  };
  const resetError = () => {
    setError(false);
  };
  useEffect(() => {
    if (interval && interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      console.log("is error at very start is", anError);
      if (anError == false) {
        try {
          decodeQr();
        } catch (error) {
          console.log("error occurred", error);
          setError(true);
        }
        console.log("is error is", anError);
      }
    }, 1000);
  }, [decodeQr, anError, setError]);
  const handleClose = () => {
    clearInterval(interval.current);
    onClose();
  };
  return (
    <div>
      <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={400}
        mirrored={true}
        videoConstraints={videoConstraints}
      />

      <p>
        {!result || result == "" ? "No Qr code found" : "Result is: " + result}
      </p>
      <div className={styles.buttonWrapper}>
        {anError ? (
          <Button
            style={{ margin: "0px 10px" }}
            onClick={resetError}
            variant="contained"
            color="secondary"
          >
            Retry
          </Button>
        ) : null}
        <Button
          disabled={!result || result === ""}
          style={{ margin: "0px 10px" }}
          onClick={() => onSubmit(result)}
          variant="contained"
          color="primary"
        >
          Save Result
        </Button>
        <Button
          style={{ margin: "0px 10px" }}
          onClick={handleClose}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
export default QrReader;
