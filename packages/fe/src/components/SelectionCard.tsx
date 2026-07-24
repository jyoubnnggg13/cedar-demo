import React from "react";
import { useTheme } from "@astryxdesign/core";

/**
 * SelectionCard Props
 */
export interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * SelectionCard 컴포넌트
 * 클릭 가능한 카드 형태의 선택 요소
 */
export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick,
  disabled = false,
}) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  const cardStyle: React.CSSProperties = {
    position: "relative" as const,
    padding: "1rem",
    borderRadius: t("--radius-element"),
    border: `2px solid ${selected ? t("--color-accent") : t("--color-border")}`,
    backgroundColor: selected
      ? `${t("--color-accent")}15`
      : t("--color-background-surface"),
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
    minWidth: "140px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center" as const,
    gap: "0.5rem",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selected
        ? `${t("--color-accent")}25`
        : `${t("--color-accent")}10`;
      e.currentTarget.style.borderColor = t("--color-accent");
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selected
        ? `${t("--color-accent")}15`
        : t("--color-background-surface");
      e.currentTarget.style.borderColor = selected
        ? t("--color-accent")
        : t("--color-border");
    }
  };

  const checkIconStyle: React.CSSProperties = {
    position: "absolute" as const,
    top: "-8px",
    right: "-8px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: t("--color-accent"),
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    opacity: selected ? 1 : 0,
    transform: selected ? "scale(1)" : "scale(0.5)",
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
  };

  const radioStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: `2px solid ${selected ? t("--color-accent") : t("--color-border")}`,
    backgroundColor: selected ? t("--color-accent") : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
  };

  const innerDotStyle: React.CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "white",
    opacity: selected ? 1 : 0,
    transition: `opacity ${theme.tokens["--duration-fast"] || "150ms"}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    margin: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: t("--color-text-secondary"),
    margin: 0,
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {selected && (
        <div style={checkIconStyle}>
          ✓
        </div>
      )}
      <div style={radioStyle}>
        <div style={innerDotStyle} />
      </div>
      {icon && <div>{icon}</div>}
      <h4 style={titleStyle}>{title}</h4>
      {description && <p style={descriptionStyle}>{description}</p>}
    </div>
  );
};

export default SelectionCard;
