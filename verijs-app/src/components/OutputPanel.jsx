import React from "react";

/**
 * Severity badge component
 */
function SeverityBadge({ severity }) {
  const labels = {
    error: "ERROR",
    warning: "WARN",
    info: "INFO",
  };
  return (
    <span className={`severity-badge severity-${severity}`}>
      {labels[severity] || severity.toUpperCase()}
    </span>
  );
}

/**
 * Single issue row
 */
function IssueRow({ issue, index }) {
  return (
    <div className={`issue-row issue-${issue.severity}`}>
      <span className="issue-index">{index + 1}</span>
      <SeverityBadge severity={issue.severity} />
      <span className="issue-line">Line {issue.line}</span>
      <span className="issue-message">{issue.message}</span>
    </div>
  );
}

/**
 * OutputPanel - Displays analysis results (right side)
 */
export default function OutputPanel({ warnings, error, analyzed }) {
  const errorCount = warnings.filter((w) => w.severity === "error").length;
  const warnCount = warnings.filter((w) => w.severity === "warning").length;
  const infoCount = warnings.filter((w) => w.severity === "info").length;

  return (
    <div className="output-panel">
      <div className="panel-header">
        <div className="panel-tab">
          <span className="output-icon">&#9888;</span>
          <span>Issues</span>
        </div>
        {analyzed && (
          <div className="issue-summary">
            {errorCount > 0 && (
              <span className="summary-badge summary-error">
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {warnCount > 0 && (
              <span className="summary-badge summary-warning">
                {warnCount} warning{warnCount !== 1 ? "s" : ""}
              </span>
            )}
            {infoCount > 0 && (
              <span className="summary-badge summary-info">
                {infoCount} info
              </span>
            )}
          </div>
        )}
      </div>
      <div className="output-container">
        {!analyzed && (
          <div className="output-placeholder">
            <div className="placeholder-icon">&#128269;</div>
            <p>Click <strong>Execute</strong> to analyze your code</p>
            <p className="placeholder-sub">
              VeriJS will detect issues like unused variables, type mismatches,
              unreachable code, and more.
            </p>
          </div>
        )}

        {analyzed && error && (
          <div className="output-error">
            <div className="error-header">&#10060; Syntax Error</div>
            <pre className="error-message">{error}</pre>
          </div>
        )}

        {analyzed && !error && warnings.length === 0 && (
          <div className="output-success">
            <div className="success-icon">&#10004;</div>
            <p>No issues found. Clean code!</p>
          </div>
        )}

        {analyzed && !error && warnings.length > 0 && (
          <div className="issues-list">
            {warnings.map((w, i) => (
              <IssueRow key={i} issue={w} index={i} />
            ))}
          </div>
        )}

        {analyzed && (
          <div className="output-footer">
            <span>
              VeriJS Analysis Report &mdash; Total issues found:{" "}
              <strong>{warnings.length}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
