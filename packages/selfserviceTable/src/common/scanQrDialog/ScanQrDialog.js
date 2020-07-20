import React, { useEffect } from "react";
const ScanQrDialog = (props) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const getInitialState = () => {
    return { videoSrc: null };
  };
  useEffect(() => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true }, handleVideo, videoError);
    }
  }, []);
  const handleVideo = (stream) => {
    // Update the state, triggering the component to re-render with the correct stream
    setVideoSrc({ videoSrc: window.URL.createObjectURL(stream) });
  };
  const videoError = () => {};
  return (
    <div>
      <video src={videoSrc} autoPlay="true" />
    </div>
  );
};

export default ScanQrDialog;
