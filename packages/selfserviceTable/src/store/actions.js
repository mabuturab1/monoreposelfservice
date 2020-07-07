import * as actionTypes from "./actionTypes";
import * as Constants from "../table/constants/Constants";
import axios from "axios";

const config = {
  headers: { Authorization: `Bearer ${Constants.bearerToken}` },
};
export const getTableDataStart = () => {
  return {
    type: actionTypes.START_FETCHING_TABLE_DATA,
  };
};
export const getTableDataFailed = () => {
  return {
    type: actionTypes.FETCHING_TABLE_DATA_FAILED,
  };
};
export const getTableDataSuccess = (data) => {
  return {
    type: actionTypes.FETCHING_TABLE_DATA_SUCCESS,
    payload: data,
  };
};
export const clearTableData = () => {
  return {
    type: actionTypes.CLEAR_TABLE_DATA,
  };
};
export const getTableHeaderStart = () => {
  return {
    type: actionTypes.START_FETCHING_TABLE_HEADER,
  };
};
export const getTableHeaderFailed = () => {
  return {
    type: actionTypes.FETCHING_TABLE_HEADER_FAILED,
  };
};

export const getTableHeaderSuccess = (data) => {
  return {
    type: actionTypes.FETCHING_TABLE_HEADER_SUCCESS,
    payload: data,
  };
};
export const removeError = () => {
  return {
    type: actionTypes.REMOVE_ERROR,
  };
};
export const getFilterData = (data) => {
  return {
    type: actionTypes.UPDATE_FILTER_DATA,
    payload: data,
  };
};

export const updateFieldDataStart = () => {
  return {
    type: actionTypes.START_UPDATING_FIELD,
  };
};
export const updateApiUrl = (data) => {
  return {
    type: actionTypes.UPDATE_API_URL,
    payload: data,
  };
};
export const updateCurrentReportId = (data) => {
  return {
    type: actionTypes.UPDATING_CURRENT_REPORT_ID,
    payload: data,
  };
};
export const updateFieldDataSuccess = (data) => {
  return {
    type: actionTypes.UPDATING_FIELD_DATA_SUCCESS,
    payload: data,
  };
};
export const updateFieldDataFailed = (data) => {
  return {
    type: actionTypes.UPDATING_FIELD_DATA_FAILED,
    payload: data,
  };
};
export const updateFieldData = (
  apiUrl,
  reportId,
  fieldId,
  data,
  newKey,
  isSuccess
) => {
  return (dispatch, getState) => {
    const currentState = getState().snackbarStatus || {};
    console.log("is updating state", currentState.isUpdating);
    if (currentState.isUpdating) {
      setTimeout(() => isSuccess(false), 100);
      return;
    }

    dispatch(updateFieldDataStart());
    let sendData = { ...data, indexIdNumber: undefined };

    axios
      .put(
        `${"/vbeta"}/reports/${reportId}/contents/${fieldId}/data`,
        sendData,
        config
      )
      .then((response) => {
        dispatch(
          updateFieldDataSuccess({
            id: fieldId,
            data: { ...data },
            newKey: newKey,
          })
        );
      })
      .catch((error) => {
        if (isSuccess) isSuccess(false);
        dispatch(
          updateFieldDataFailed({ newKey: newKey ? newKey : undefined })
        );
      });
  };
};

export const getTableData = (apiUrl, reportId, params, isNewData = false) => {
  return (dispatch) => {
    dispatch(getTableDataStart());
    if (isNewData) dispatch(clearTableData());
    return axios
      .get(`${"/vbeta"}/reports/${reportId}/contents`, {
        ...config,
        params: params,
      })
      .then((response) => {
        let resData = response.data || { contents: [], contentsTotal: 1 };

        if (response)
          dispatch(
            getTableDataSuccess({
              tableData: resData.contents,

              totalReportItems: resData.contentsTotal,
            })
          );
        else dispatch(getTableDataFailed());
      })
      .catch((error) => {
        dispatch(getTableDataFailed());
      });
  };
};

export const getTableHeader = (apiUrl, reportId) => {
  return (dispatch) => {
    dispatch(getTableHeaderStart());
    axios
      .get(`${"/vbeta"}/reports/${reportId}/fields`, config)
      .then((response) => {
        if (response) dispatch(getTableHeaderSuccess(response.data));
        else dispatch(getTableHeaderFailed());
      })
      .catch((error) => {
        dispatch(getTableHeaderFailed());
      });
  };
};
