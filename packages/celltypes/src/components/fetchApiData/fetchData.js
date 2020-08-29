import * as axios from "axios";
const config = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
export const getDropdownData = (
  apiUrl,
  reportType,
  collection,
  fieldKey,
  bearerToken
) => {
  axios
    .get(
      `${"/vbeta"}/distincts/${reportType}/${collection}/${fieldKey}`,
      config(bearerToken)
    )
    .then((response) => {
      if (response) dispatch(getTableHeaderSuccess(response.data));
      else dispatch(getTableHeaderFailed());
    })
    .catch((error) => {
      dispatch(getTableHeaderFailed());
    });
};
export const getSubfieldsData = (
  apiUrl,
  reportType,
  collection,
  params,

  bearerToken,
  callback
) => {
  axios
    .get(`${"/vbeta"}/distincts/${reportType}/${collection}`, {
      ...config(bearerToken),
      params: params,
    })
    .then((response) => {
      if (response && response.data) callback(response.data);
    })
    .catch((error) => {
      callback(null);
    });
};
