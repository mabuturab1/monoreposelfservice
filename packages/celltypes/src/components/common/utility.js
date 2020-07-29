export const currencyFormatter = (
  mNumber,
  mCurrencySymbol,
  mThouSep,
  mDecSep,
  mAllowedDecimals,
  unit
) => {
  let thouSep = mThouSep ? mThouSep : "";
  let decSep = mDecSep ? mDecSep : ".";
  let currencySymbol = mCurrencySymbol ? mCurrencySymbol : "";
  let allowedDecimals = mAllowedDecimals ? mAllowedDecimals : 0;
  let numPart = "";
  let decPart = "";
  let finalNumPart = "";
  if (mNumber === null || mNumber === "") return "";
  var number = parseFloat(mNumber).toFixed(allowedDecimals);

  var arr = number.split(".");

  if (arr[0]) numPart = arr[0];
  if (arr[1]) decPart = arr[1];

  if (numPart.length < 4) return currencySymbol + numPart + decSep + decPart;

  for (let i = 0; i < numPart.length; i++) {
    finalNumPart += numPart[i];
    let remNumLength = numPart.length - (i + 1);
    if (remNumLength % 3 === 0 && remNumLength > 0)
      finalNumPart = finalNumPart + thouSep;
  }

  return currencySymbol + finalNumPart + decSep + decPart + unit;
};

export const checkArrEqual = (arr1, arr2) => {
  let first = arr1.filter((el) => !arr2.includes(el));
  if (first.length > 0) return false;
  let second = arr2.filter((el) => !arr1.includes(el));
  if (second.length > 0) return false;
  return true;
};
