import * as axios from "axios";
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
export const uploadFile = async (
  data,
  type,

  isSuccess
) => {
  let formData = await getFormData(data, type);
  axios
    .post(`${"/vbeta"}/uploads`, formData, config)
    .then((response) => {
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
