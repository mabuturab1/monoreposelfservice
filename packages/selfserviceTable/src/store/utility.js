import { getFormattedDate } from "../table/utility/objectsFunctions";

export const updateObject = (
  oldObject,
  updatedProperties,
  concatKey = "",
  concat = false,
  filterById = false
) => {
  if (concat && oldObject[concatKey] && updatedProperties[concatKey]) {
    const prevObj = oldObject[concatKey].map((el) => ({ ...el }));
    let newObj = [];
    if (!filterById) {
      newObj = prevObj.concat(updatedProperties[concatKey]);
    } else {
      let prevObjIds = prevObj.map((el) => el.id);
      const uniqueItems = (updatedProperties[concatKey] || []).filter(
        (el) => !prevObjIds.includes(el.id)
      );

      newObj = prevObj.concat(uniqueItems);
    }

    return {
      ...oldObject,
      [concatKey]: newObj,
    };
  } else
    return {
      ...oldObject,
      ...updatedProperties,
    };
};
export const getParams = (queryParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", queryParams.pageNumber);
  params.append("pageSize", queryParams.pageSize);
  if (queryParams.key !== "") params.append("sortBy", queryParams.key);
  if (queryParams.order !== "")
    params.append("sortDirection", queryParams.order);
  if (queryParams.filters.toString() !== "") {
    queryParams.filters.forEach((value, key) => {
      params.append(key, value);
    });
  }
  if (queryParams.search !== "") params.append("search", queryParams.search);
  if (queryParams.start != null)
    params.append("start", getFormattedDate(queryParams.start));
  if (queryParams.end != null)
    params.append("end", getFormattedDate(queryParams.end));
  return params;
};
