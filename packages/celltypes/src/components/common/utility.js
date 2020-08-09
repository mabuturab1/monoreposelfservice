export const currencyFormatter = (
  mNumber,
  mCurrencySymbol,
  mThouSep,
  mDecSep,
  mAllowedDecimals,
  mUnit
) => {
  let thouSep = mThouSep ? mThouSep : "";
  let decSep = mDecSep ? mDecSep : ".";
  let currencySymbol = mCurrencySymbol ? mCurrencySymbol : "";
  let allowedDecimals = mAllowedDecimals ? mAllowedDecimals : 0;
  let unit = mUnit ? mUnit : "";
  let numPart = "";
  let decPart = "";
  let finalNumPart = "";
  if (mNumber === null || mNumber === "") return "";
  var number = parseFloat(mNumber).toFixed(allowedDecimals);

  var arr = number.split(".");

  if (arr[0]) numPart = arr[0];
  if (arr[1]) decPart = arr[1];

  if (numPart.length < 4)
    return currencySymbol + numPart + decPart && decPart.length > 0
      ? decSep + decPart
      : "";

  for (let i = 0; i < numPart.length; i++) {
    finalNumPart += numPart[i];
    let remNumLength = numPart.length - (i + 1);
    if (remNumLength % 3 === 0 && remNumLength > 0)
      finalNumPart = finalNumPart + thouSep;
  }

  return (
    currencySymbol +
    finalNumPart +
    (decPart && decPart.length > 0 ? decSep + decPart : "") +
    unit
  );
};

export const checkArrEqual = (arr1, arr2) => {
  let first = arr1.filter((el) => !arr2.includes(el));
  if (first.length > 0) return false;
  let second = arr2.filter((el) => !arr1.includes(el));
  if (second.length > 0) return false;
  return true;
};
export const DropdownState = {
  open: "open",
  closed: "closed",
  untouched: "untouched",
};
export const validateExtensions = (fileInput, _validFileExtensions) => {
  console.log("ENTERED IN VALIDATION");

  var sFileName = fileInput.name;
  console.log("FILE NAME IS", sFileName);
  if (sFileName.length > 0) {
    var blnValid = false;
    for (var j = 0; j < _validFileExtensions.length; j++) {
      var sCurExtension = _validFileExtensions[j];
      console.log("CHECKING FOR EXTENSION", _validFileExtensions[j]);
      if (
        sFileName
          .substr(sFileName.length - sCurExtension.length, sCurExtension.length)
          .toLowerCase() == sCurExtension.toLowerCase()
      ) {
        blnValid = true;
        console.log("VALIDATION SUCCESS");
        break;
      }
    }
    console.log("VALIDATION FAILED");
    if (!blnValid) {
      alert(
        "Sorry, " +
          sFileName +
          " is invalid, allowed extensions are: " +
          _validFileExtensions.join(", ")
      );
      return false;
    }
  }

  return true;
};
