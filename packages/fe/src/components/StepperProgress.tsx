import React from "react";
import { useTheme, VStack, HStack, Text, Badge } from "@astryxdesign/core";
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

  // Styles - Astryx components use spacing props instead of inline styles

  return (
    <VStack
      alignItems="center"
      padding="1rem"
      backgroundColor={t("--color-background-muted")}
      borderRadius={t("--radius-element")}
      marginBottom="1.5rem"
      gap="1rem"
    >
      <HStack alignItems="center" justifyContent="space-between" flex={1} gap="0">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isPast = index < currentStep || isCompleted;
          const isCurrent = currentStep === index;
          const isClickable = !disabled && (index <= currentStep || completedSteps.includes(index));

          return (
            <React.Fragment key={step.id}>
              <VStack
                alignItems="center"
                gap="0.5rem"
                cursor={disabled ? "not-allowed" : isPast ? "pointer" : "default"}
                opacity={disabled ? 0.5 : 1}
                onClick={() => isClickable && onStepClick(index)}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={`Step ${step.id}: ${step.title}`}
              >
                <Badge
                  variant={isCompleted ? "success" : isCurrent ? "primary" : "default"}
                  label={isCompleted ? "✓" : String(step.id)}
                />
                <Text
                  size="xs"
                  weight={isCurrent ? "semibold" : "regular"}
                  color={isCurrent ? "primary" : "secondary"}
                  textAlign="center"
                >
                  {step.title}
                </Text>
              </VStack>
              {index < steps.length - 1 && (
                <VStack
                  flex={1}
                  height="2px"
                  backgroundColor={isPast ? t("--color-accent") : t("--color-border")}
                  margin="0 0.5rem"
                  alignItems="stretch"
                />
              )}
            </React.Fragment>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default StepperProgress;
