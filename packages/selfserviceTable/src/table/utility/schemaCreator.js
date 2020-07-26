import * as yup from "yup";

const schemaCreator = (headerCellSpecs) => {
  let { type, data } = headerCellSpecs;
  if (!yup[toYup(type)]) return {};
  let validator = yup[toYup(type)]();
  const { yupType, params } = localAssignments(type);
  if (yupType && validator[yupType]) validator = validator[yupType](...params);

  if (!data) return validator;

  Object.keys(data).forEach((el) => {
    const { yupType, params } = getYupData(type, el, data);
    if (!validator[yupType] || !yupType) return;
    validator = validator[yupType](...params);
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
      return "string";
  }
};

const getYupData = (fieldType, JsonKey, JsonData) => {
  switch (JsonKey) {
    case "isRequired":
      return {
        yupType: "required",
        params: ["This field is required"],
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
const getNumber = (value) => {
  if (!isNaN(value)) return parseFloat(value);
  return 0;
};
export default schemaCreator;
