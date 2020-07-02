import React from "react";
let tableContext = React.createContext({
  editAllowed: false,
  setEditAllowed: () => {},
});
export default tableContext;
