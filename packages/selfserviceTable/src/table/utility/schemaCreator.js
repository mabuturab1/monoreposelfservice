import * as yup from "yup";

const schemaCreator = (headerCellSpecs, nullable = false) => {
  let { type, data } = headerCellSpecs;
  if (!yup[toYup(type)]) return {};
  let validator = yup[toYup(type)]();

  const { yupType, params } = localAssignments(type);
  if (yupType && validator[yupType]) validator = validator[yupType](...params);
  if (nullable) {
    validator = validator["nullable"]();
  }
  if (!data || data["isDisabled"]) return validator;

  Object.keys(data).forEach((el) => {
    if (data[el]) {
      const { yupType, params } = getYupData(type, el, data);
      if (!validator[yupType] || !yupType) return;

      validator = validator[yupType](...params);
    }
  });
  return validator;
};
const localAssignments = (type) => {
  if (toYup(type) === "number")
    return {
      yupType: "typeError",
      params: ["Kindly specify a number"],
    };
  return {
    yupType: null,
    params: null,
  };
};
const toYup = (type) => {
  switch (type) {
    case "TEXT":
    case "TEXT_AREA":
    case "PHONENUMBER":
    case "EMAIL":
      return "string";
    case "NUMBER":
    case "RATE":
    case "DECIMAL":
      return "number";
    case "SWITCH":
      return "bool";
    case "DATETIME":
      return "string";
    case "IMAGE":
      return "mixed";
    default:
      return "mixed";
  }
};
const isValueExist = (val) => {
  return val !== null && val !== undefined;
};
const checkValidValue = (val) => {
  if (isValueExist(val)) return val;
  else return null;
};
const hasValue = (val) => {
  if (typeof val === "object") return Object.keys(val).length > 0;
  else return String(val).length > 0;
};
const includesValue = (value, refValue, start = 0) => {
  let val = String(value);

  if (Array.isArray(refValue))
    return {
      isIndex: true,
      index: refValue.findIndex((el) => val.substring(start).startsWith(el)),
    };
  // console.log(val.substring(start), val.substring(start).startsWith(refValue));
  return { isIndex: false, equal: val.substring(start).startsWith(refValue) };
};
const hasPrefixes = (value, prefix, prevValues, prevValStart = 0) => {
  let start = 0;

  if (prevValues) {
    let obj = includesValue(value, prevValues);
    if (obj.isIndex && obj.index >= 0) start = prevValues[obj.index].length;
    else if (!obj.isIndex && obj.equal)
      start = prevValStart + prevValues.length;
    // console.log("prev obj is", obj, start);
  }
  const currentObj = includesValue(value, prefix, start);
  if (currentObj.isIndex && currentObj.index >= 0) return true;
  if (!currentObj.isIndex && currentObj.equal) return true;

  return false;
};
const getYupData = (fieldType, JsonKey, JsonData) => {
  switch (JsonKey) {
    case "isRequired":
      return {
        yupType: "test",
        params: [
          "len",
          "This field is required",
          isCheckbox(fieldType)
            ? (val) => isValueExist(val) && Array.isArray(val) && val.length > 0
            : (val) => isValueExist(val) && hasValue(val),
        ],
      };
    case "email":
      return { yupType: "email", params: ["This email is not valid"] };

    case "isPrefixed":
      return {
        yupType: "test",
        params: [
          "len",
          `Please use Indonesian prefix in format ${JsonData[JsonKey]}xxxxxx`,
          (val) => {
            return checkValidValue(val) == null
              ? false
              : val.toString().slice(0, JsonData[JsonKey].length) ===
                  JsonData[JsonKey].toString();
          },
        ],
      };
    case "maxLength":
      return {
        yupType: "test",
        params: [
          "len",
          `The field cannot exceed ${JsonData[JsonKey]} characters,whitespace included`,
          (val) =>
            checkValidValue(val) == null
              ? false
              : val.toString().length <= getNumber(JsonData[JsonKey]),
        ],
      };

    case "minLength":
      return {
        yupType: "test",
        params: [
          "len",
          `Must be minimum ${JsonData[JsonKey]} characters`,
          (val) =>
            checkValidValue(val) == null
              ? false
              : val.toString().length >= getNumber(JsonData[JsonKey]),
        ],
      };
    case "countryCode":
      return {
        yupType: "test",
        params: [
          "len",
          `Please use following prefix as ${JsonKey}: ${JsonData[JsonKey]}`,
          (val) =>
            checkValidValue(val) == null
              ? false
              : hasPrefixes(val, JsonData[JsonKey], null),
        ],
      };
    case "prefixes":
      return {
        yupType: "test",
        params: [
          "len",
          `Kindly use country code & prefixes, specified in field edit mode`,
          (val) =>
            checkValidValue(val) == null
              ? false
              : hasPrefixes(val, JsonData[JsonKey], JsonData["countryCode"], 0),
        ],
      };
    case "max":
      return {
        yupType: !isDateField(fieldType) ? "test" : null,
        params: !isDateField(fieldType)
          ? [
              "len",
              `Must be maximum ${JsonData[JsonKey]}`,
              (val) =>
                checkValidValue(val) == null
                  ? false
                  : getNumber(val) <= getNumber(JsonData[JsonKey]),
            ]
          : null,
      };
    case "min":
      return {
        yupType: toYup(fieldType) !== "date" ? "test" : null,
        params: !isDateField(fieldType)
          ? [
              "len",
              `Must be minimum ${JsonData[JsonKey]}`,
              (val) =>
                checkValidValue(val) == null
                  ? false
                  : getNumber(val) >= getNumber(JsonData[JsonKey]),
            ]
          : null,
      };
    default:
      return { yupType: null, params: null };
  }
};
const isDateField = (fieldType) => {
  return toYup(fieldType) === "date";
};
const isCheckbox = (fieldType) => {
  return fieldType === "checkbox";
};
const getNumber = (value) => {
  if (!isNaN(value)) {
    return parseFloat(value);
  }
  return -1 * Infinity;
};
export default schemaCreator;
