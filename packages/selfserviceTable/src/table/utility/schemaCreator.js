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
  return val != null && val != undefined;
};
const hasValue = (val) => {
  if (typeof val === "object") return Object.keys(val).length > 0;
  else return val.length > 0;
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
            ? (val) =>
                isValueExist(val) && typeof val === "array" && val.length > 0
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
            return (
              val &&
              val.toString().slice(0, JsonData[JsonKey].length) ===
                JsonData[JsonKey].toString()
            );
          },
        ],
      };
    case "maxLength":
      return {
        yupType: "test",
        params: [
          "len",
          `The field cannot exceed ${JsonData[JsonKey]} characters,whitespace included`,
          (val) => val && val.toString().length <= getNumber(JsonData[JsonKey]),
        ],
      };

    case "minLength":
      return {
        yupType: "test",
        params: [
          "len",
          `Must be minimum ${JsonData[JsonKey]} characters`,
          (val) => val && val.toString().length >= getNumber(JsonData[JsonKey]),
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
                val && val && getNumber(val) <= getNumber(JsonData[JsonKey]),
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
                val && val && getNumber(val) >= getNumber(JsonData[JsonKey]),
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
  if (!isNaN(value)) return parseFloat(value);
  return 0;
};
export default schemaCreator;
