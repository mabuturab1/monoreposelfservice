export const isEqual = (obj1, obj2) => {
  return Object.keys(obj1).findIndex((el) => obj1[el] !== obj2[el]) === -1;
};
