import React from "react";

/**
 * Toolbar - Top bar with branding, actions
 */
export default function Toolbar({ onExecute, onClear, onReset }) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <h1 className="brand-name">VeriJS</h1>
        <span className="brand-tag">Static Analyzer</span>
      </div>
      <div className="toolbar-actions">
        <button className="btn btn-reset" onClick={onReset} title="Reset to sample code">
          &#8635; Reset
        </button>
        <button className="btn btn-clear" onClick={onClear} title="Clear output">
          Clear
        </button>
        <button className="btn btn-execute" onClick={onExecute} title="Analyze code">
          &#9654; Execute
        </button>
      </div>
    </header>
  );
}
