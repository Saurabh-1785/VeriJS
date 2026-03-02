import React from "react";
import Editor from "@monaco-editor/react";

/**
 * CodeEditor - Monaco-based code editor panel (left side)
 */
export default function CodeEditor({ code, onChange }) {
  return (
    <div className="editor-panel">
      <div className="panel-header">
        <div className="panel-tab">
          <span>main.js</span>
        </div>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            automaticLayout: true,
            padding: { top: 12 },
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
