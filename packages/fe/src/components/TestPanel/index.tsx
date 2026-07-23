import React from "react";

export interface EvaluationResult {
  decision: "Permit" | "Deny";
  reason?: string;
  errors?: string[];
}

export interface TestPanelProps {
  onEvaluate: () => Promise<EvaluationResult>;
  result?: EvaluationResult;
}

export function TestPanel({ onEvaluate, result }: TestPanelProps) {
  return (
    <div className="test-panel">
      <div className="test-panel-header">
        <h3>Test Panel</h3>
      </div>
      <div className="test-panel-content">
        <button onClick={onEvaluate} className="evaluate-button">
          Run Evaluation
        </button>
        {result && (
          <div className={`evaluation-result ${result.decision.toLowerCase()}`}>
            <h4>Result: {result.decision}</h4>
            {result.reason && <p>{result.reason}</p>}
            {result.errors && result.errors.length > 0 && (
              <div className="errors">
                <h5>Errors:</h5>
                <ul>
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
