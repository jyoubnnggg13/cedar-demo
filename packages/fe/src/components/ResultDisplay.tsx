/**
 * ResultDisplay Component
 * 
 * Displays the authorization evaluation result with visual badges.
 */

import { useTheme, Badge } from "@astryxdesign/core";
import type { EvaluateResponse } from "../types/evaluation";

interface ResultDisplayProps {
  result: EvaluateResponse | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  if (!result) {
    return null;
  }

  const isAllow = result.decision === "ALLOW";

  const containerStyle: React.CSSProperties = {
    marginTop: "1rem",
  };

  const detailsStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: t("--color-background-muted"),
    borderRadius: t("--radius-element"),
    border: `1px solid ${t("--color-border")}`,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: t("--color-text-secondary"),
    marginBottom: "0.25rem",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "1rem",
    color: t("--color-text-primary"),
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <Badge
        variant={isAllow ? "success" : "error"}
        label={result.decision}
        icon={isAllow ? "✓" : "✗"}
      />

      {isAllow ? (
        <div style={detailsStyle}>
          <p style={{ color: t("--color-text-secondary"), margin: 0 }}>
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
