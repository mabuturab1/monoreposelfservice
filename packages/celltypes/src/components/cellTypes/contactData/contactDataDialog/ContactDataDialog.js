import React from "react";
import ReadOnlyText from "../../readOnlyText/ReadOnlyText";

const ContactDataDialog = ({ items }) => {
  const cellTypes = [
    { key: "name", label: "Name.", type: "READONLY_TEXT" },
    { key: "msisdn", label: "MSISDN.", type: "READONLY_TEXT" },
    { key: "start", label: "Start", type: "READONLY_TEXT" },
    { key: "end", label: "End", type: "READONLY_TEXT" },
    { key: "duration", label: "Duration", type: "READONLY_TEXT" },
  ];
  const tableHeader = [];
  cellTypes.forEach((el) => {
    <div style={{ display: "inline-block", width: "5rem" }}>
      return <ReadOnlyText value={el.label} />
    </div>;
  });
  const tableData = [];
  if (items)
    items.forEach((td, i) => {
      tableData.push(
        <div key={i}>
          {cellTypes.map((el, j) => {
            return (
              <div
                key={i.toString() + j}
                style={{ display: "inline-block", width: "5rem" }}
              >
                <ReadOnlyText value={td[el]} />
              </div>
            );
          })}
        </div>
      );
    });

  return (
    <div>
      {tableHeader}
      {tableData}
    </div>
  );
};
export default ContactDataDialog;
