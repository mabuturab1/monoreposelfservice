import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NewRecordDialog from "./newRecordDialog/NewRecordDialog";

function App(props) {
  return <NewRecordDialog {...props} />;
}

export default App;
