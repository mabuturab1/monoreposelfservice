import * as axios from "axios";
const getFormData = async (localData, type) => {
  console.log("local image file url is", localData);

  if (!localData) return;
  if (type && String(type).toUpperCase() === "YOUTUBE") {
    const formData = new FormData();
    formData.append("type", String(type).toUpperCase());
    formData.append("embedUrl", String(localData));
    return formData;
  }
  let blob = await fetch(localData).then((r) => r.blob());
  let file = new File([blob], "test");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", String(type).toUpperCase());
  return formData;
};
const config = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
export const uploadFile = async (
  apiUrl,
  reportType,
  data,
  type,
  token,
  isSuccess
) => {
  let formData = await getFormData(data, type);
  axios
    .post(`${"/vbeta"}/uploads`, formData, config(token))
    .then((response) => {
      console.log("RESPONS OF UPLOAD", response);
      if (response) {
        isSuccess(true, response.data);
      } else {
        isSuccess(false);
      }
    })
    .catch((error) => {
      isSuccess(false);
    });
};
