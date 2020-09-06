import React, { useRef, useState } from "react";
import TableCell from "../../TableCell";
import { getSubfieldsData } from "../../fetchApiData/fetchData";
const NestedDropdown = ({
  editAllowed,
  myKey,
  className,
  name,
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
  setFieldValue,
  apiUrl,
  item,
  bearerToken,
}) => {
  let collection = serverData.collection;
  let reportType = serverData.reportType;

  let dropdownData = useRef(item && item.value ? item.value : {});
  const [queryParams, setQueryParams] = useState(new URLSearchParams());
  const [currentFieldKeyIndex, setCurrentFieldKeyIndex] = useState(0);
  const [fieldsData, setFieldsData] = useState(
    serverData && serverData.fields ? serverData.fields : []
  );

  const getNewData = (fieldKey, newKey, newValue) => {
    const params = new URLSearchParams();
    queryParams.forEach((value, key) => {
      params.append(key, value);
    });
    if (!params.has(newKey)) params.append(newKey, newValue);
    else params.set(newKey, newValue);
    getSubfieldsData(
      apiUrl,
      reportType,
      collection,
      fieldKey,
      params,
      bearerToken,
      (data) => {
        if (data === null || data.length < 1) return;
        let newArr = fieldsData.map((el) => ({ ...el }));
        let fieldIndex = newArr.findIndex((el) => el.key === fieldKey);
        if (fieldIndex < 0) return;

        newArr[fieldIndex] = {
          ...newArr[fieldIndex],
          options: data,
        };
        setCurrentFieldKeyIndex(fieldIndex);
        setFieldsData(newArr);
      }
    );
  };
  const isKeyEnabled = (keyVal) => {
    let fieldIndex = fieldsData.findIndex((el) => el.key === keyVal);
    return fieldIndex <= currentFieldKeyIndex;
  };
  const getNextFieldKey = (prevKey) => {
    let index = fieldsData.findIndex((el) => el.key === prevKey);
    console.log(fieldsData, index, prevKey);
    if (index < 0 || index + 1 >= fieldsData.length) return null;
    return fieldsData[index + 1].key;
  };
  const mUpdateFieldData = (rowId, data, key, isSuccess, updateKey) => {
    dropdownData.current = {
      ...rowData.data[cellOriginalKey],
      ...dropdownData.current,
      ...data,
    };
    let previousValues = { ...dropdownData.current };
    fieldsData.forEach((el) => {
      if (!isKeyEnabled(el.key)) delete previousValues[el.key];
    });
    dropdownData.current = { ...previousValues };

    let nextFieldKey = getNextFieldKey(key);

    if (nextFieldKey) {
      getNewData(nextFieldKey, key, data[key]);
    }

    updateFieldData(
      rowData.id,
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

  if (fieldsData && fieldsData.length > 0) {
    itemsList = fieldsData.map((el, i) => {
      let localKey = getKey(myKey, el.key);

      return (
        <div key={i} style={{ flex: 1, minWidth: "160px" }}>
          <TableCell
            {...{
              rowWidth,
              rowHeight,
              handlerFunctions,

              appSchemaObj,
              appErrorObj,
              appTouchedObj,
              className,
            }}
            cellOriginalKey={el.key}
            editAllowed={
              (editAllowed != null ? editAllowed : true) && isKeyEnabled(el.key)
            }
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
