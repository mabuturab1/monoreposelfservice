import React from "react";
import TableCell from "../../TableCell";
const NestedDropdown = ({
  editAllowed,
  myKey,
  className,

  rowWidth,
  rowHeight,
  serverData,
  handlerFunctions,
  rowData,
  cellOriginalKey,
  updateFieldData,
  appSchemaObj,
  appErrorObj,
  appTouchedObj,
  item,
}) => {
  // console.log("STARTING NEW PRINT");
  // console.log(
  //   "edit allowed",
  //   editAllowed,
  //   "key",
  //   myKey,
  //   "classname",
  //   className,
  //   "rowWidth",
  //   rowWidth,
  //   "rowHeight",
  //   rowHeight,
  //   "serverData",
  //   serverData,
  //   "handle functions",
  //   handlerFunctions,
  //   "row data",
  //   rowData,
  //   "cell original key",
  //   cellOriginalKey,
  //   "update field data",
  //   updateFieldData,
  //   "app schema obj",
  //   appSchemaObj,
  //   "app error obj",
  //   appErrorObj,
  //   "app touched obj",
  //   appTouchedObj,
  //   "item",
  //   item
  // );
  const getKey = (tableDataId, fieldKey) => {
    return tableDataId + fieldKey;
  };
  let itemsList = [];
  console.log("server data is", serverData);
  if (serverData && serverData.fields) {
    console.log("server data fields", serverData.fields);
    itemsList = serverData.fields.map((el, i) => {
      let localKey = getKey(myKey, el.key);

      return (
        <div key={i} style={{ flex: 1, minWidth: "160px" }}>
          <TableCell
            {...{
              editAllowed,
              rowWidth,
              rowHeight,
              handlerFunctions,
              rowData,
              cellOriginalKey,
              updateFieldData,
              appSchemaObj,
              appErrorObj,
              appTouchedObj,
              className,
            }}
            serverData={{ ...el }}
            myKey={localKey}
            item={{
              name: localKey,
              value: item && item.value ? item.value[el.key] : "",
              fallbackValue: item && item.value ? item.value : null,
              error: appErrorObj ? appErrorObj[localKey] : null,
              touched: appTouchedObj ? appTouchedObj[localKey] === true : false,
              validationSchema: appSchemaObj
                ? appSchemaObj[localKey]
                : undefined,
              type: el.type,
            }}
          />
        </div>
      );
    });
  }
  console.log("item list is", itemsList);

  return (
    <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
      {itemsList}
    </div>
  );
};
export default NestedDropdown;
