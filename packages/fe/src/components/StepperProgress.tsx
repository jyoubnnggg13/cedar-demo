import React from "react";
import { useTheme } from "@astryxdesign/core";
import type { Step } from "../types/policy";

/**
 * StepperProgress Props
 */
export interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (index: number) => void;
  disabled?: boolean;
}

/**
 * StepperProgress 컴포넌트
 * 4단계 네비게이션을 제공하는 Stepper UI
 */
export const StepperProgress: React.FC<StepperProgressProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  disabled = false,
}) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: t("--color-background-muted"),
    borderRadius: t("--radius-element"),
    marginBottom: "1.5rem",
  };

  const stepWrapperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  };

  const getStepStyle = (index: number): React.CSSProperties => {
    const isCompleted = completedSteps.includes(index);
    const isPast = index < currentStep || isCompleted;

    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      cursor: disabled ? "not-allowed" : isPast ? "pointer" : "default",
      opacity: disabled ? 0.5 : 1,
      transition: `opacity ${theme.tokens["--duration-fast"] || "150ms"}`,
    };
  };

  const getCircleStyle = (index: number): React.CSSProperties => {
    const isCompleted = completedSteps.includes(index);
    const isCurrent = currentStep === index;

    let backgroundColor = t("--color-background-muted");
    let borderColor = t("--color-border");
    let color = t("--color-text-secondary");

    if (isCompleted) {
      backgroundColor = t("--color-accent");
      borderColor = t("--color-accent");
      color = "white";
    } else if (isCurrent) {
      backgroundColor = t("--color-accent");
      borderColor = t("--color-accent");
      color = "white";
    }

    return {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: `2px solid ${borderColor}`,
      backgroundColor,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: "0.875rem",
      transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
    };
  };

  const getConnectorStyle = (index: number): React.CSSProperties => {
    const isPast = index < currentStep || completedSteps.includes(index);

    return {
      flex: 1,
      height: "2px",
      backgroundColor: isPast
        ? t("--color-accent")
        : t("--color-border"),
      margin: "0 0.5rem",
      transition: `background-color ${theme.tokens["--duration-fast"] || "150ms"}`,
    };
  };

  const getLabelStyle = (index: number): React.CSSProperties => {
    const isCurrent = currentStep === index;

    return {
      fontSize: "0.75rem",
      fontWeight: isCurrent ? 600 : 400,
      color: isCurrent
        ? t("--color-text-primary")
        : t("--color-text-secondary"),
      textAlign: "center" as const,
      whiteSpace: "nowrap" as const,
    };
  };

  return (
    <div style={containerStyle}>
      <div style={stepWrapperStyle}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={getStepStyle(index)}
              onClick={() => !disabled && (index <= currentStep || completedSteps.includes(index)) && onStepClick(index)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Step ${step.id}: ${step.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  !disabled && (index <= currentStep || completedSteps.includes(index)) && onStepClick(index);
                }
              }}
            >
              <div style={getCircleStyle(index)}>
                {completedSteps.includes(index) ? "✓" : step.id}
              </div>
              <span style={getLabelStyle(index)}>{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={getConnectorStyle(index)}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepperProgress;
