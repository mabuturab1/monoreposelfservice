import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

const exampleCode = `{
  "key":"",
  "value":""
}
`;

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.code || exampleCode);

  return (
    <Editor
      value={code}
      onValueChange={(mcode) => setCode(mcode)}
      highlight={(mCode) => highlight(mCode, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        border: "1px solid #707070",
        width: props.width ? props.width : "20rem",
        backgroundColor: "#F9FAFF",
        borderRadius: "10px",
      }}
    />
  );
};
export default CodeEditor;
