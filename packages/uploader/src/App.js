import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Uploader from "./components/uploader/Uploader";

function App(props) {
  return <Uploader {...{ ...props }} />;
}

export default App;
