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

const QrReader = ({ onClose, onSubmit, valueChanged }) => {
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

    if (code != null) setResult(code);
    if (valueChanged && code != null) valueChanged(code.data);
  }, [webcamRef]);

  const resetError = () => {
    setError(false);
  };
  useEffect(() => {
    if (interval && interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      if (anError == false) {
        try {
          decodeQr();
        } catch (error) {
          setError(true);
        }
      }
    }, 1000);
    return function cleanup() {
      handleClose();
    };
  }, [decodeQr, anError, setError]);
  const handleClose = () => {
    clearInterval(interval.current);
    // onClose();
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

      <p className={styles.text}>
        {result && result.data
          ? "Result is: " + result.data
          : "No Qr code found"}
      </p>
      <div className={styles.buttonWrapper}>
        {anError ? (
          <Button
            style={{ margin: "0px 0.6rem" }}
            onClick={resetError}
            variant="contained"
            color="secondary"
          >
            Retry
          </Button>
        ) : null}
        <Button
          disabled={!result || result === ""}
          style={{ margin: "0px 0.6rem", fontSize: "0.75rem" }}
          onClick={() => onSubmit(result.data)}
          variant="contained"
          color="primary"
        >
          Save Result
        </Button>
        <Button
          style={{ margin: "0px 0.6rem", fontSize: "0.75rem" }}
          onClick={handleClose}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
export default QrReader;
