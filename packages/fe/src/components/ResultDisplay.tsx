/**
 * ResultDisplay Component
 * 
 * Displays the authorization evaluation result with visual badges.
 */

import { useTheme } from "@astryxdesign/core";
import type { EvaluateResponse } from "../types/evaluation";

interface ResultDisplayProps {
  result: EvaluateResponse | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const theme = useTheme();

  if (!result) {
    return null;
  }

  const isAllow = result.decision === "ALLOW";

  const containerStyle: React.CSSProperties = {
    marginTop: "1rem",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--radius-element)",
    fontSize: "1.25rem",
    fontWeight: 600,
    backgroundColor: isAllow ? "#22c55e" : "#ef4444",
    color: "white",
  };

  const iconStyle: React.CSSProperties = {
    width: "1.5rem",
    height: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const detailsStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: theme.tokens.color.backgroundSecondary,
    borderRadius: "var(--radius-element)",
    border: `1px solid var(--color-border-default)`,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: theme.tokens.color.textSecondary,
    marginBottom: "0.25rem",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "1rem",
    color: theme.tokens.color.textPrimary,
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <div style={badgeStyle}>
        <span style={iconStyle}>{isAllow ? "✓" : "✗"}</span>
        <span>{result.decision}</span>
      </div>

      {isAllow ? (
        <div style={detailsStyle}>
          <p style={{ color: theme.tokens.color.textSecondary, margin: 0 }}>
            모든 Forbid 정책이 미매칭 → 요청이 허용됩니다
          </p>
        </div>
      ) : (
        <div style={detailsStyle}>
          <div style={{ marginBottom: "0.75rem" }}>
            <p style={labelStyle}>매칭된 정책</p>
            <p style={valueStyle}>{result.matchedPolicy || "-"}</p>
          </div>
          {result.reason && (
            <div>
              <p style={labelStyle}>이유</p>
              <p style={valueStyle}>{result.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
