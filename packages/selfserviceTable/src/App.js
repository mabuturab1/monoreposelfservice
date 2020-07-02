import React from "react";

import "./App.scss";
import Table from "./table/Table";

function App() {
  return (
    <div className="App">
      <Table apiUrl={"http://35.174.214.251:12123/vbeta"} editAllowed={true} />
    </div>
  );
}

export default App;
