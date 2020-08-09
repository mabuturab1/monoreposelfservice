import * as actionTypes from "./actionTypes";
import { updateObject } from "./utility";

const errorMessage =
  "We are unable to process your request this time. Make sure you are connected to internet and reload the page";
const initialState = {
  tableData: [],
  tableHeader: [],
  tableHeaderPending: false,
  tableDataPending: false,
  filterData: { data: {}, numFilters: 0 },
  serverError: "",
  currentReportId: "",
  apiAddress: "",
  fieldUpdateStatus: { success: false, error: false },
  totalReportItems: 0,
  queryParams: {},
  fetchData: 1,
  totalUpdateFieldErrors: 0,
  snackbarStatus: {
    updated: false,
    cellKey: "",
    error: false,
    isUpdating: false,
    content: null,
  },
};
let addIndexHeader = (data) => {
  if (!data || data.length < 1) return [];
  return [{ key: "indexIdNumber", label: "No.", type: "READONLY_TEXT" }].concat(
    data
  );
};
let addIndexNumber = (data, indexStart) => {
  let preLoadedItems = indexStart;

  if (!data || data.length < 1) return [];
  return data.map((el, index) => ({
    ...el,
    data: {
      ...el.data,
      indexIdNumber: index + 1 + preLoadedItems,
      createAt: el.createAt,
    },
  }));
};
const getUpdatedTableData = (tableData, payload) => {
  let index = tableData.findIndex((el) => el.id === payload.id);
  if (index < -1) return null;
  let newTableData = tableData.map((el) => ({
    id: el.id,
    data: { ...el.data },
  }));
  newTableData[index] = {
    id: payload.id,
    data: { ...payload.data, actions: true },
  };
  return newTableData;
};
const getUpdatedTableHeader = (tableHeader, payload) => {
  let index = tableHeader.findIndex((el) => el.key === payload);
  console.log("index is", index, payload);
  if (index < 0) return tableHeader;
  let updatedTableHeader = tableHeader.map((el) => ({ ...el }));
  updatedTableHeader[index] = payload;
  console.log("updatedTableHeader is", updatedTableHeader.slice());
  return updatedTableHeader;
};
const deleteTableHeader = (tableHeader, payload) => {
  let index = tableHeader.findIndex((el) => el.key === payload);

  if (index < 0) return tableHeader;
  let updatedTableHeader = tableHeader.map((el) => ({ ...el }));
  updatedTableHeader.splice(index, 1);
  console.log("updatedTableHeader is", updatedTableHeader.slice());
  return updatedTableHeader;
};
const deleteTableContent = (tableData, payload) => {
  let index = tableData.findIndex((el) => el.id === payload);

  if (index < 0) return tableData;
  let updatedTableData = tableData.map((el) => ({ ...el }));
  updatedTableData.splice(index, 1);
  console.log("updatedTableData is", updatedTableData.slice());
  return updatedTableData;
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_FETCHING_TABLE_DATA:
      return updateObject(state, { tableDataPending: true });
    case actionTypes.ADD_CONTENT_SUCCESS:
    case actionTypes.FETCHING_TABLE_DATA_SUCCESS:
      let tableDataUpdate = updateObject(
        state,
        {
          tableData: addIndexNumber(
            action.payload.tableData,
            state.tableData.length
          ),
        },
        "tableData",
        true,
        true
      );
      return updateObject(tableDataUpdate, {
        tableDataPending: false,
        totalReportItems: action.payload.totalReportItems,
      });
    case actionTypes.DELETE_CONTENT_SUCCESS:
      return updateObject(state, {
        tableData: addIndexNumber(
          deleteTableContent(state.tableData, action.payload),
          0
        ),
        snackbarStatus: {
          isUpdating: false,
          error: false,
          cellKey: "",
          updated: true,
          content: "Data is deleted successfully",
        },
        totalReportItems: state.totalReportItems - 1,
      });
    case actionTypes.CLEAR_TABLE_DATA:
      return updateObject(state, { tableData: [] });
    case actionTypes.FETCHING_TABLE_DATA_FAILED:
      return updateObject(state, {
        tableDataPending: false,
        serverError: errorMessage,
      });
    case actionTypes.START_FETCHING_TABLE_HEADER:
      return updateObject(state, { tableHeaderPending: true });

    case actionTypes.FETCHING_TABLE_HEADER_SUCCESS:
      return updateObject(state, {
        tableHeaderPending: false,
        tableHeader: addIndexHeader(action.payload),
      });
    case actionTypes.FETCHING_TABLE_HEADER_FAILED:
      return updateObject(state, {
        tableHeaderPending: false,
        serverError: errorMessage,
      });
    case actionTypes.FETCH_NEW_DATA:
      return updateObject(state, { fetchData: state.fetchData + 1 });
    case actionTypes.ADD_FIELD_SUCCESS:
      console.log("PREV TABLE HEADER", state.tableHeader);
      console.log(
        "new table header",
        (state.tableHeader || []).concat(action.payload)
      );
      return updateObject(state, {
        tableHeader: (state.tableHeader || []).concat(action.payload),
      });
    case actionTypes.EDIT_FIELD_SUCCESS:
      let updatedTableHeader = getUpdatedTableHeader(
        state.tableHeader,
        action.payload
      );
      return updateObject(state, {
        tableHeader: updatedTableHeader,
      });
    case actionTypes.DELETE_FIELD_SUCCESS:
      console.log(action.type, action.payload);
      let modifiedTableHeader = deleteTableHeader(
        state.tableHeader,
        action.payload
      );
      console.log("modified table header", modifiedTableHeader);
      return updateObject(state, {
        tableHeader: modifiedTableHeader,
      });

    case actionTypes.UPDATE_FILTER_DATA:
      return updateObject(state, { filterData: action.payload });
    case actionTypes.REMOVE_ERROR:
      return updateObject(state, { serverError: "" });
    case actionTypes.UPDATING_CURRENT_REPORT_ID:
      return updateObject(state, { currentReportId: action.payload });
    case actionTypes.UPDATE_API_URL:
      return updateObject(state, { apiAddress: action.payload });
    case actionTypes.UPDATING_QUERY_PARAMS:
      return updateObject(state, { queryParams: action.payload });
    case actionTypes.START_UPLOAD_FILE:
    case actionTypes.START_UPDATING_FIELD:
      return updateObject(state, {
        snackbarStatus: {
          isUpdating: true,
          error: false,
          cellKey: "",
          updated: false,
          content: action.payload,
        },
      });
    case actionTypes.START_DELETE_CONTENT:
      return updateObject(state, {
        snackbarStatus: {
          isUpdating: true,
          error: false,
          cellKey: "",
          updated: false,
          content: "Deleting Table Data",
        },
      });

    case actionTypes.UPDATING_FIELD_DATA_SUCCESS:
      if (!action.payload.id || !action.payload.data) return { ...state };
      let newTableData = getUpdatedTableData(state.tableData, action.payload);
      if (newTableData === null) return { ...state };

      return updateObject(state, {
        tableData: newTableData,
        snackbarStatus: {
          isUpdating: false,
          error: false,
          cellKey:
            action.payload && action.payload.newKey
              ? action.payload.newKey
              : "",
          updated: true,
        },
      });
    case actionTypes.UPLOAD_FILE_SUCCESS:
      return updateObject(state, {
        snackbarStatus: {
          isUpdating: false,
          error: false,
          cellKey: "",
          updated: true,
          content: "File uploaded successfully",
        },
      });
    case actionTypes.UPLOAD_FILE_FAILED:
    case actionTypes.UPDATING_FIELD_DATA_FAILED:
    case actionTypes.DELETE_CONTENT_FAILED:
      return updateObject(state, {
        totalUpdateFieldErrors: state.totalUpdateFieldErrors + 1,
        snackbarStatus: {
          isUpdating: false,
          error: true,
          cellKey:
            action.payload && action.payload.newKey
              ? action.payload.newKey
              : "",
          updated: false,
        },
      });
    default:
      return state;
  }
};
export default reducer;
