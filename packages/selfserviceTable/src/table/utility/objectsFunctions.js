export const isEqual = (obj1, obj2) => {
  return Object.keys(obj1).findIndex((el) => obj1[el] !== obj2[el]) === -1;
};
export const getFormattedDate = (dateObj, fallback = "") => {
  if (!dateObj) return fallback;
  if (!(dateObj instanceof Date)) return fallback;

  var month = dateObj.getMonth() + 1; //months from 1-12
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();

  return year + "-" + getTwoDigitsNumber(month) + "-" + getTwoDigitsNumber(day);
};
let getTwoDigitsNumber = (val) => {
  return ("0" + val.toString()).trim().slice(-2);
};
