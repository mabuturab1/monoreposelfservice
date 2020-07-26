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
  totalReportItems: 1,
  totalUpdateFieldErrors: 0,
  snackbarStatus: {
    updated: false,
    cellKey: "",
    error: false,
    isUpdating: false,
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
    data: { ...el.data, indexIdNumber: index + 1 + preLoadedItems },
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
    data: { ...payload.data },
  };
  return newTableData;
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_FETCHING_TABLE_DATA:
      return updateObject(state, { tableDataPending: true });
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
    case actionTypes.UPDATE_FILTER_DATA:
      return updateObject(state, { filterData: action.payload });
    case actionTypes.REMOVE_ERROR:
      return updateObject(state, { serverError: "" });
    case actionTypes.UPDATING_CURRENT_REPORT_ID:
      return updateObject(state, { currentReportId: action.payload });
    case actionTypes.UPDATE_API_URL:
      return updateObject(state, { apiAddress: action.payload });
    case actionTypes.START_UPDATING_FIELD:
      return updateObject(state, {
        snackbarStatus: {
          isUpdating: true,
          error: false,
          cellKey: "",
          updated: false,
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
          cellKey: action.payload.newKey,
          updated: true,
        },
      });
    case actionTypes.UPDATING_FIELD_DATA_FAILED:
      return updateObject(state, {
        totalUpdateFieldErrors: state.totalUpdateFieldErrors + 1,
        snackbarStatus: {
          isUpdating: false,
          error: true,
          cellKey: action.payload.newKey,
          updated: false,
        },
      });
    default:
      return state;
  }
};
export default reducer;
