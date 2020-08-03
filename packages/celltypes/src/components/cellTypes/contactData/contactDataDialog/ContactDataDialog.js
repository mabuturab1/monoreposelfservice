import React from "react";
import ReadOnlyText from "../../readOnlyText/ReadOnlyText";
import styles from "./ContactDataDialog.module.scss";
import StyledInput from "../../../common/styledInput/StyledInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const ContactDataDialog = ({ items, onClose, sum }) => {
  const cellTypes = [
    { key: "name", label: "Name.", type: "READONLY_TEXT" },
    { key: "msisdn", label: "MSISDN.", type: "READONLY_TEXT" },
    { key: "start", label: "Start", type: "READONLY_TEXT" },
    { key: "end", label: "End", type: "READONLY_TEXT" },
    { key: "duration", label: "Duration", type: "READONLY_TEXT" },
  ];
  let tableHeader = [];
  tableHeader = cellTypes.map((el, i) => (
    <div key={i} className={styles.headerItemWrapper}>
      <ReadOnlyText
        value={el.label}
        style={{ display: "flex", justifyContent: "center" }}
      />
    </div>
  ));
  const tableData = [];
  console.log("items are", items);
  if (items)
    items.forEach((td, i) => {
      tableData.push(
        <div key={i} className={styles.optionRowWrapper}>
          {cellTypes.map((el, j) => {
            return (
              <div key={i.toString() + j} className={styles.option}>
                <StyledInput
                  value={td[el.key]}
                  readOnly={true}
                  style={{ textAlign: "center" }}
                />
              </div>
            );
          })}
        </div>
      );
    });

  return (
    <React.Fragment>
      <div className={styles.dialogHeaderWrapper}>
        <h6 className={[styles.text, styles.title].join(" ")}>
          Contact Details
        </h6>
        <FontAwesomeIcon icon={faTimes} onClick={onClose} />
      </div>
      <div className={styles.contactDialogWrapper}>
        <div className={styles.headerWrapper}>{tableHeader}</div>
        {tableData}
      </div>
      <div className={styles.summaryWrapper}>
        <h4 className={[styles.text, styles.title].join(" ")}>Summary</h4>
        <div className={styles.summary}>
          <div className={styles.singleDetailWrapper}>
            <div className={styles.labelWrapper}>
              <span className={styles.text}>{"Date"}</span>
              <span className={styles.text}>:</span>
            </div>
            <span className={styles.text}>{sum.date}</span>
          </div>
          <div className={styles.singleDetailWrapper}>
            <div className={styles.labelWrapper}>
              <span className={styles.text}>{"Call Duration"}</span>
              <span className={styles.text}>:</span>
            </div>
            <span className={styles.text}>{sum.duration}</span>
          </div>
          <div className={styles.singleDetailWrapper}>
            <div className={styles.labelWrapper}>
              <span className={styles.text}>{"Total Call"}</span>
              <span className={styles.text}>:</span>
            </div>
            <span className={styles.text}>{sum.call}</span>
          </div>
          <div className={styles.singleDetailWrapper}>
            <div className={styles.labelWrapper}>
              <span className={styles.text}>{"Total whatsapp"}</span>
              <span className={styles.text}>:</span>
            </div>
            <span className={styles.text}>{sum.whatsapp}</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ContactDataDialog;
