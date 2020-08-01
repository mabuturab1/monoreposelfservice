import React, { useRef } from "react";
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
  let dropdownData = useRef(item && item.value ? item.value : {});
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
  const mUpdateFieldData = (rowId, data, key, isSuccess, updateKey) => {
    dropdownData.current = {
      ...dropdownData.current,
      ...data,
    };
    updateFieldData(
      rowId,
      {
        ...rowData.data,
        [cellOriginalKey]: { ...dropdownData.current },
      },
      cellOriginalKey,
      isSuccess,
      updateKey
    );
  };
  const getKey = (tableDataId, fieldKey) => {
    return tableDataId + fieldKey;
  };
  let itemsList = [];

  if (serverData && serverData.fields) {
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

              appSchemaObj,
              appErrorObj,
              appTouchedObj,
              className,
            }}
            cellOriginalKey={el.key}
            rowData={{ data: {} }}
            updateFieldData={mUpdateFieldData}
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

  return (
    <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
      {itemsList}
    </div>
  );
};
export default NestedDropdown;
