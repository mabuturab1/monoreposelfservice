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

    if (!blnValid) {
      console.log("VALIDATION FAILED");
      return false;
    }
  }

  return true;
};
