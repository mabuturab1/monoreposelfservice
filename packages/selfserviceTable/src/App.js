import React from "react";

import "./App.scss";
import Table from "./table/Table";

function App() {
  return (
    <div className="App">
      <Table
        apiUrl={"http://35.174.214.251:12123/vbeta"}
        tableDataUrl={"reports"}
        currentReportId={"5ee2ec25570a12e08291ce09"}
        reportType={"reports"}
        editAllowed={false}
        contentAddAble={true}
        contentEditAble={true}
        contentDeleteAble={true}
        fieldAddAble={true}
        fieldEditAble={true}
        fieldDeleteAble={true}
        createAt={true}
      />
    </div>
  );
}

export default App;
