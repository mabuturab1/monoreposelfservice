import BlankImage from "../../../assets/images/blankImage.png";
export const CellTypes = [
  { label: "Text", value: "TEXT" },
  { label: "Text Area", value: "TEXT_AREA" },
  { label: "Phone Number", value: "PHONENUMBER" },
  { label: "Email", value: "EMAIL" },
  { label: "Number", value: "NUMBER" },
  { label: "Decimal", value: "DECIMAL" },
  { label: "Rate", value: "RATE" },
  { label: "Dropdown", value: "DROPDOWN" },

  { label: "Image", value: "IMAGE" },
  { label: "DateTime", value: "DATETIME" },
];
export const DummyInitValues = {
  TEXT: "",
  TEXT_AREA: "",
  PHONENUMBER: "",
  EMAIL: "",
  NUMBER: "",
  DECIMAL: "",
  RATE: 0,
  IMAGE: BlankImage,
  DATETIME: "",
  DROPDOWN: "",
  READONLY_TEXT: "",
  SWITCH: false,
  CURRENCY: "",
  CHECKBOX: [],
  RADIO: "",
  OFFICER_SELECT: "",
  SCAN_QR: "",
  LOUNGE_FILE: "",
  CONTACT: "",
  MAP: "",
  ITEM_LIST: "",
  NETSTED_DROPDOWN: {},
};
