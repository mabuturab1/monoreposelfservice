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
