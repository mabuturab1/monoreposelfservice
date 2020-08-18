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

export const getUploadFileStart = (content = null) => {
  return {
    type: actionTypes.START_UPLOAD_FILE,
    payload: content != null ? content : "Kindly wait while file is uploading",
  };
};
export const getUploadFileFailed = () => {
  return {
    type: actionTypes.UPLOAD_FILE_FAILED,
  };
};
export const getUploadFileSuccess = (data) => {
  return {
    type: actionTypes.UPLOAD_FILE_SUCCESS,
    payload: data,
  };
};

export const getAddContentStart = () => {
  return {
    type: actionTypes.START_ADD_CONTENT,
  };
};
export const getAddContentFailed = () => {
  return {
    type: actionTypes.ADD_CONTENT_FAILED,
  };
};
export const getAddContentSuccess = (data) => {
  return {
    type: actionTypes.ADD_CONTENT_SUCCESS,
    payload: data,
  };
};

export const getEditContentStart = () => {
  return {
    type: actionTypes.START_EDIT_CONTENT,
  };
};
export const getEditContentFailed = () => {
  return {
    type: actionTypes.EDIT_CONTENT_FAILED,
  };
};
export const getEditContentSuccess = (data) => {
  return {
    type: actionTypes.EDIT_CONTENT_SUCCESS,
    payload: data,
  };
};

export const getDeleteContentStart = () => {
  return {
    type: actionTypes.START_DELETE_CONTENT,
  };
};
export const getDeleteContentFailed = () => {
  return {
    type: actionTypes.DELETE_CONTENT_FAILED,
  };
};
export const getDeleteContentSuccess = (data) => {
  return {
    type: actionTypes.DELETE_CONTENT_SUCCESS,
    payload: data,
  };
};

export const getAddFieldStart = () => {
  return {
    type: actionTypes.START_ADD_FIELD,
  };
};
export const getAddFieldFailed = () => {
  return {
    type: actionTypes.ADD_FIELD_FAILED,
  };
};
export const getAddFieldSuccess = (data) => {
  console.log("ADD FIELD SUCCESS", data);
  return {
    type: actionTypes.ADD_FIELD_SUCCESS,
    payload: data,
  };
};

export const getEditFieldStart = () => {
  return {
    type: actionTypes.START_EDIT_FIELD,
  };
};
export const getEditFieldFailed = () => {
  return {
    type: actionTypes.EDIT_FIELD_FAILED,
  };
};
export const getEditFieldSuccess = (data) => {
  return {
    type: actionTypes.EDIT_FIELD_SUCCESS,
    payload: data,
  };
};

export const getDeleteFieldStart = () => {
  return {
    type: actionTypes.START_DELETE_FIELD,
  };
};
export const getDeleteFieldFailed = () => {
  return {
    type: actionTypes.DELETE_FIELD_FAILED,
  };
};
export const getDeleteFieldSuccess = (data) => {
  return {
    type: actionTypes.DELETE_FIELD_SUCCESS,
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

export const updateFieldDataStart = (msg) => {
  return {
    type: actionTypes.START_UPDATING_FIELD,
    payload: msg,
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

export const updateQueryParams = (data) => {
  return {
    type: actionTypes.UPDATING_QUERY_PARAMS,
    payload: data,
  };
};
export const fetchNewData = () => {
  return {
    type: actionTypes.FETCH_NEW_DATA,
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
const getFormData = async (localData, type) => {
  console.log("local image file url is", localData);

  if (!localData) return;
  let blob = await fetch(localData).then((r) => r.blob());
  let file = new File([blob], "test");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  return formData;
};
export const uploadFile = (
  apiUrl,
  reportId,
  rowId,
  data,
  type,
  newKey,
  isSuccess,
  forcedUpdate = false
) => {
  return async (dispatch, getState) => {
    const currentState = getState().snackbarStatus || {};
    console.log(
      "is updating state in upload file",
      currentState.isUpdating && !forcedUpdate
    );
    if (currentState.isUpdating && !forcedUpdate) {
      setTimeout(() => isSuccess(false), 100);
      return;
    }
    dispatch(getUploadFileStart());
    let formData = await getFormData(data, type);
    axios
      .post(`${"/vbeta"}/uploads`, formData, config)
      .then((response) => {
        if (response) {
          dispatch(getUploadFileSuccess(response.data));
          isSuccess(true, response.data);
        } else {
          dispatch(getUploadFileFailed());

          isSuccess(false);
        }
      })
      .catch((error) => {
        isSuccess(false);
        dispatch(getUploadFileFailed());
      });
  };
};

export const addTableContent = (apiUrl, reportId, data, isSuccess) => {
  return (dispatch, getState) => {
    dispatch(getAddContentStart());
    axios
      .post(`${"/vbeta"}/reports/${reportId}/contents`, data, config)
      .then((response) => {
        console.log("ADD TABLE CONTENT RESPONSE", response.data.data);
        if (response && response.data && response.data.data) {
          dispatch(
            getAddContentSuccess({
              tableData: [
                {
                  id: new Date().getTime().toString(),
                  data: response.data.data,
                },
              ],
              totalReportItems: (getState().totalReportItems || 0) + 1,
            })
          );
          isSuccess(true);
        } else {
          dispatch(getAddContentFailed());
          isSuccess(false);
        }
      })
      .catch((error) => {
        console.log("ERROR OCCURRED IN TABLE", error);
        dispatch(getAddContentFailed());
        isSuccess(false);
      });
  };
};

export const updateFieldData = (
  apiUrl,
  reportId,
  rowId,
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

    dispatch(updateFieldDataStart("Kindly wait while data is updating"));
    let sendData = {
      ...data,
      indexIdNumber: undefined,
      actions: undefined,
      createAt: undefined,
    };

    axios
      .put(
        `${"/vbeta"}/reports/${reportId}/contents/${rowId}`,
        sendData,
        config
      )
      .then((response) => {
        dispatch(
          updateFieldDataSuccess({
            id: rowId,
            data: { ...data },
            newKey: newKey,
          })
        );
        isSuccess(true);
      })
      .catch((error) => {
        if (isSuccess) isSuccess(false);
        dispatch(
          updateFieldDataFailed({ newKey: newKey ? newKey : undefined })
        );
      });
  };
};

export const deleteTableContent = (apiUrl, reportId, fieldId, isSuccess) => {
  return (dispatch) => {
    dispatch(getDeleteContentStart());

    axios
      .delete(`${"/vbeta"}/reports/${reportId}/contents/${fieldId}`, config)
      .then((response) => {
        if (response) {
          dispatch(getDeleteContentSuccess(fieldId));
          if (isSuccess) isSuccess(true);
        } else {
          dispatch(getDeleteContentFailed());
          if (isSuccess) isSuccess(false);
        }
      })
      .catch((error) => {
        dispatch(getDeleteContentFailed());
      });
  };
};

export const addTableField = (apiUrl, reportId, data, isSuccess) => {
  return (dispatch, state) => {
    dispatch(getAddFieldStart());
    axios
      .post(`${"/vbeta"}/reports/${reportId}/fields`, data, config)
      .then((response) => {
        if (response && response.data && response.data.data) {
          dispatch(getAddFieldSuccess(response.data.data));
          dispatch(fetchNewData());
          if (isSuccess) isSuccess(true);
        } else {
          dispatch(getAddFieldFailed());
          if (isSuccess) isSuccess(false);
        }
      })
      .catch((error) => {
        dispatch(getAddFieldFailed());
        isSuccess(false);
      });
  };
};

export const editTableField = (apiUrl, reportId, fieldKey, data, isSuccess) => {
  return (dispatch) => {
    dispatch(getEditFieldStart());
    axios
      .put(`${"/vbeta"}/reports/${reportId}/fields/${fieldKey}`, data, config)
      .then((response) => {
        if (response) {
          dispatch(getEditFieldSuccess(response.data));
          dispatch(fetchNewData());
          if (isSuccess) isSuccess(true);
        } else {
          dispatch(getEditFieldFailed());
          if (isSuccess) isSuccess(false);
        }
      })
      .catch((error) => {
        dispatch(getEditFieldFailed());
        if (isSuccess) isSuccess(false);
      });
  };
};

export const deleteTableField = (apiUrl, reportId, fieldKey, isSuccess) => {
  return (dispatch) => {
    dispatch(getDeleteFieldStart());
    axios
      .delete(`${"/vbeta"}/reports/${reportId}/fields/${fieldKey}`, config)
      .then((response) => {
        if (response) {
          dispatch(getDeleteFieldSuccess(fieldKey));
          if (isSuccess) isSuccess(true);
        } else {
          dispatch(getDeleteFieldFailed());
          if (isSuccess) isSuccess(false);
        }
      })
      .catch((error) => {
        dispatch(getDeleteFieldFailed());
        if (isSuccess) isSuccess(false);
      });
  };
};
