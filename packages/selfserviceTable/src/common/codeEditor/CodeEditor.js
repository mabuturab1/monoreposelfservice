import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styles from "./CodeEditor.module.scss";
import isEqual from "lodash.isequal";

const exampleCode = `{
  "key":"",
  "value":""
}
`;

const CodeEditor = (props) => {
  let value = props.code || exampleCode;
  const [code, setCode] = useState({ originalCode: value, tempCode: value });
  const [error, setError] = useState(false);
  const [inValidKey, setInvalidKey] = useState(false);
  if (props.code != null && !isEqual(code.originalCode, props.code))
    setCode({ originalCode: props.code, tempCode: props.code });
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
    if (!IsJsonString(code.tempCode)) {
      setError(true);
      console.log("returning");
      return;
    } else if (error === true) setError(false);
    let obj = JSON.parse(code.tempCode);
    let invalid = Object.keys(obj).filter((el) => inValidKeysList.includes(el));
    if (invalid && invalid.length > 0) {
      setInvalidKey(true);
      return;
    } else if (inValidKey === true) setInvalidKey(false);
    if (props.updateAdditionalSettings) {
      props.updateAdditionalSettings(code.tempCode);
    }
  };
  return (
    <React.Fragment>
      <Editor
        value={code.tempCode}
        onValueChange={(mcode) => setCode({ ...code, tempCode: mcode })}
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
          Invalid JSON Error
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
