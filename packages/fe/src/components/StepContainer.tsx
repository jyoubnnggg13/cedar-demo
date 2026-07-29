import React from "react";
import { Button, VStack, HStack, Heading, Text } from "@astryxdesign/core";

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
  const borderColor = error ? "#ef4444" : "var(--color-border)";

  return (
    <VStack
      gap={2}
      padding={4}
      style={{ borderRadius: "var(--radius-element)", backgroundColor: "var(--color-background-surface)", border: `1px solid ${borderColor}` }}
      align="stretch"
    >
      {/* Header */}
      <HStack gap={2} justify="between" wrap="wrap" align="start">
        <VStack gap={1} align="start">
          <Heading level={3} color="primary">
            {title}
          </Heading>
          {subtitle && (
            <Text size="xsm" color="secondary">
              {subtitle}
            </Text>
          )}
        </VStack>
        {showBulkActions && (
          <HStack gap={1}>
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
          </HStack>
        )}
      </HStack>

      {/* Content */}
      <HStack gap={2} wrap="wrap" justify="start">
        {children}
      </HStack>

      {/* Error */}
      {error && (
        <Text size="sm" color="accent" style={{ backgroundColor: "var(--color-status-error-bg)", padding: "var(--spacing-1)", borderRadius: "var(--radius-element)" }}>
          {error}
        </Text>
      )}
    </VStack>
  );
};

export default StepContainer;
