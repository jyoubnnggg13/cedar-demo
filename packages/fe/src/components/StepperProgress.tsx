import React from "react";
import { HStack, VStack, Text, Badge } from "@astryxdesign/core";
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
  return (
    <HStack
      gap={1}
      padding={2}
      justify="center"
      style={{ backgroundColor: "var(--color-background-muted)", borderRadius: "var(--radius-element)", marginBottom: "var(--spacing-4)" }}
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;
        const isPast = index < currentStep || isCompleted;
        const isClickable = !disabled && isPast;

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <VStack
              gap={1}
              align="center"
              onClick={() => isClickable && onStepClick(index)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Step ${step.id}: ${step.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  isClickable && onStepClick(index);
                }
              }}
              style={{
                cursor: isClickable ? "pointer" : disabled ? "not-allowed" : "default",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Badge
                variant={isCompleted ? "success" : isCurrent ? "info" : "neutral"}
                label={isCompleted ? "✓" : String(step.id)}
              />
              <Text
                size="xsm"
                weight={isCurrent ? "semibold" : "normal"}
                color={isCurrent ? "primary" : "secondary"}
              >
                {step.title}
              </Text>
            </VStack>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: isPast
                    ? "--color-accent"
                    : "--color-border",
                  margin: "0 0.5rem",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </HStack>
  );
};

export default StepperProgress;
