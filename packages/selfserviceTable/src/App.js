import React from "react";

import "./App.scss";
import Table from "./table/Table";

function App() {
  return (
    <div className="App">
      <Table
        apiUrl={"http://35.174.214.251:12123/vbeta"}
        currentReportId={"5ee2ec25570a12e08291ce09"}
        editAllowed={false}
      />
    </div>
  );
}

export default App;
