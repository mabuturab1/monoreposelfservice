import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styles from "./CodeEditor.module.scss";

const exampleCode = `{
  "key":"",
  "value":""
}
`;

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.code || exampleCode);
  const [error, setError] = useState(false);
  const [inValidKey, setInvalidKey] = useState(false);

  const inValidKeysList = [
    "data",
    "key",
    "label",
    "type",
    "isDisabled",
    "isRequired",
  ];
  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  const updateMCode = () => {
    if (!IsJsonString(code)) {
      setError(true);
      console.log("JSON IS INVALID");
      return;
    } else if (error === true) setError(false);
    let obj = JSON.parse(code);
    let invalid = Object.keys(obj).filter((el) => inValidKeysList.includes(el));
    if (invalid && invalid.length > 0) {
      setInvalidKey(true);
      return;
    } else if (inValidKey === true) setInvalidKey(false);
    if (props.updateAdditionalSettings) {
      props.updateAdditionalSettings(code);
    }
  };
  return (
    <React.Fragment>
      <Editor
        value={code}
        onValueChange={(mcode) => setCode(mcode)}
        highlight={(mCode) => highlight(mCode, languages.js)}
        padding={10}
        onBlur={(e) => updateMCode()}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          border: "1px solid #707070",
          width: props.width ? props.width : "20rem",
          backgroundColor: "#F9FAFF",
          borderRadius: "0.6rem",
          borderColor: error ? "red" : undefined,
        }}
      />
      {error ? (
        <p
          className={styles.errorText}
          style={{ width: props.width ? props.width : "20rem" }}
        >
          Invalid JSON Code. Kindly follow JSON pattern as follows
          <strong>("key":value,)</strong> Please ensure that you have declared
          keys in inverted commas and also used single comma after each value
          except last one
        </p>
      ) : null}
      {inValidKey ? (
        <p
          className={styles.errorText}
          style={{ width: props.width ? props.width : "20rem" }}
        >
          Following keys are not allowed ( data, type, key, label, isDisabled,
          isRequired)
        </p>
      ) : null}
    </React.Fragment>
  );
};
export default CodeEditor;
