export const fields = [
  {
    isRequired: true,
    label: "Nama Cust.",
    type: "TEXT",
    key: "custname",
    isDisabled: false,
    value: "Doni",
    placeholder: "",
    maxLength: 100,
    minLength: 5,
  },
  {
    isRequired: true,
    label: "Alasan",
    type: "TEXT_AREA",
    key: "alasan",
    isDisabled: false,
    value: "Good",
    placeholder: "Click here to writesomething",
    maxLength: 999,
  },
  {
    isRequired: true,
    label: "Phone Num",
    type: "PHONENUMBER",
    key: "nomor_hp",
    isDisabled: false,
    value: "08123123",
    placeholder: "08xxx",
    isPrefixed: "08",
    maxLength: 14,
  },
  {
    isRequired: true,
    label: "Rating",
    type: "RATE",
    key: "rating",
    isDisabled: false,
    value: "1020213",
    placeholder: "Rate",
    decimalCount: 0,
    min: 1,
    max: 5,
    unit: null,
  },
  {
    isRequired: true,
    label: "Foto Customer",
    type: "IMAGE",
    key: "foto",
  },
  {
    isRequired: true,
    label: "ProductMass",
    type: "DECIMAL",
    key: "mass",
    isDisabled: false,
    value: "10",
    placeholder: "Mass",
    decimalCount: 2,
    min: 0,
    max: 200,
    unit: "Kg",
  },
  // {
  //   isRequired: true,
  //   label: "Waktu Kunjungan",
  //   type: "DATETIME",
  //   key: "wkt_knj",
  //   isDisabled: false,
  //   value: "2020-05-19 08:00",
  //   pickers: ["DATE", "TIME"],
  //   showFormat: "dd MMM YYYY HH:mm",
  //   submitFormat: "YYYY-MM-DD hh:mm:ss a",
  //   decodeFormat: "yyyy-MM-DD HH:mm:ss",
  //   min: "2020-05-18 00:00",
  //   max: "2020-05-20 00:00",
  // },
  {
    isRequired: true,
    label: "Status",
    type: "DROPDOWN",
    key: "status",
    isDisabled: false,
    value: "Approve",
    options: ["Approve", "Reject"],
    placeholder: "Please select status",
  },
];

export const myData = [
  {
    id: "1a",
    data: {
      custname: "Doni",
      alasan: "Niceapp",
      nomor_hp: "08123123123",
      rate: 5,
    },
  },
  {
    id: "1b",
    data: {
      custname: "Johny",
      alasan: "yeahh",
      nomor_hp: "0814564561",
      rate: 4,
    },
  },
  {
    id: "1c",
    data: {
      custname: "Rick",
      alasan: "Loveit but...",
      nomor_hp: "081231234",
      rate: 3,
    },
  },
  {
    id: "2a",
    data: {
      custname: "Tanu",
      alasan: "Not very good",
      nomor_hp: "0888888",
      rate: 2,
    },
  },
  {
    id: "3a",
    data: {
      custname: "Jaya",
      alasan: "Niceapp",
      nomor_hp: "081231231223",
      rate: 5,
    },
  },
  {
    id: "4a",
    data: {
      custname: "Jack",
      alasan: "Niceapp",
      nomor_hp: "081231231213",
      rate: 5,
    },
  },
];
const getTableData = () => {
  let values = [];
  for (let i = 0; i < 1; i++) {
    myData.forEach((el) => {
      values.push({ ...el, _id: el._id + i });
    });
  }
  return values;
};
export const data = getTableData();
