import React from "react";
import { useTheme, Button } from "@astryxdesign/core";

/**
 * StepContainer Props
 */
export interface StepContainerProps {
  title: string;
  subtitle?: string;
  showBulkActions?: boolean;
  onSelectAll: () => void;
  onSelectNone: () => void;
  error?: string;
  children: React.ReactNode;
}

/**
 * StepContainer 컴포넌트
 * 스텝 콘텐츠와 전체선택/전체해제 버튼을 제공하는 컨테이너
 */
export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  subtitle,
  showBulkActions = false,
  onSelectAll,
  onSelectNone,
  error,
  children,
}) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  const containerStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderRadius: t("--radius-element"),
    backgroundColor: t("--color-background-surface"),
    border: `1px solid ${error ? "#ef4444" : t("--color-border")}`,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  };

  const titleWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: t("--color-text-secondary"),
    margin: 0,
  };

  const bulkActionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
  };

  // button styles 제거 - Astryx Button 사용

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "1rem",
    justifyContent: "flex-start",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: t("--radius-element"),
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "0.875rem",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleWrapperStyle}>
          <h3 style={titleStyle}>{title}</h3>
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
        {showBulkActions && (
          <div style={bulkActionsStyle}>
            <Button
              label="Select All"
              variant="primary"
              size="sm"
              onClick={onSelectAll}
            />
            <Button
              label="None"
              variant="secondary"
              size="sm"
              onClick={onSelectNone}
            />
          </div>
        )}
      </div>
      <div style={contentStyle}>
        {children}
      </div>
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
};

export default StepContainer;
