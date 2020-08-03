import React from "react";

import "./App.scss";
import Table from "./table/Table";

import StyledMenuList from "../src/common/menuList/MenuList";
import CellEditDialog from "../src/common/cellEditDialog/cellEditDialog";

function App() {
  return (
    <div className="App">
      <Table
        apiUrl={"http://35.174.214.251:12123/vbeta"}
        currentReportId={"5ee2ec25570a12e08291ce09"}
        editAllowed={false}
        contentAddAble={true}
        contentEditAble={true}
        contentDeleteAble={true}
        fieldAddAble={true}
        fieldEditAble={true}
        fieldDeleteAble={true}
      />
    </div>
  );
}

export default App;
