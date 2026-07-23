import React from "react";

export interface ResultDisplayProps {
  result?: {
    decision: "Permit" | "Deny";
    reason?: string;
    errors?: string[];
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <div className="result-display">
        <div className="result-empty">
          <p>Run a test to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`result-display ${result.decision.toLowerCase()}`}>
      <div className="result-header">
        <h3>Evaluation Result</h3>
        <span className={`decision-badge ${result.decision.toLowerCase()}`}>
          {result.decision}
        </span>
      </div>
      {result.reason && (
        <div className="result-reason">
          <h4>Reason</h4>
          <p>{result.reason}</p>
        </div>
      )}
      {result.errors && result.errors.length > 0 && (
        <div className="result-errors">
          <h4>Errors</h4>
          <ul>
            {result.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
