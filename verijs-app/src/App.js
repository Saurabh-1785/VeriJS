import React, { useState, useCallback } from "react";
import { Toolbar, CodeEditor, OutputPanel } from "./components";
import { analyzeCode } from "./analyzer";
import SAMPLE_CODE from "./constants/sampleCode";
import "./App.css";

function App() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handleExecute = useCallback(() => {
    const result = analyzeCode(code);
    setWarnings(result.warnings);
    setError(result.error);
    setAnalyzed(true);
  }, [code]);

  const handleClear = useCallback(() => {
    setWarnings([]);
    setError(null);
    setAnalyzed(false);
  }, []);

  const handleReset = useCallback(() => {
    setCode(SAMPLE_CODE);
    setWarnings([]);
    setError(null);
    setAnalyzed(false);
  }, []);

  const handleCodeChange = useCallback((value) => {
    setCode(value || "");
  }, []);

  return (
    <div className="app">
      <Toolbar
        onExecute={handleExecute}
        onClear={handleClear}
        onReset={handleReset}
      />
      <main className="workspace">
        <CodeEditor code={code} onChange={handleCodeChange} />
        <OutputPanel warnings={warnings} error={error} analyzed={analyzed} />
      </main>
    </div>
  );
}

export default App;
