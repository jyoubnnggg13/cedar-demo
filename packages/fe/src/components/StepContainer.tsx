import React from "react";
import { useTheme, Button, VStack, HStack, Heading, Text } from "@astryxdesign/core";

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
  const borderColor = error ? "#ef4444" : t("--color-border");

  return (
    <VStack
      gap="md"
      padding="lg"
      borderRadius="element"
      backgroundColor="--color-background-surface"
      border={`1px solid ${borderColor}`}
      alignItems="stretch"
    >
      {/* Header */}
      <HStack gap="md" justifyContent="space-between" wrap alignItems="flex-start">
        <VStack gap="xs" alignItems="flex-start">
          <Heading level={3} size="base" fontWeight="semibold" color="--color-text-primary">
            {title}
          </Heading>
          {subtitle && (
            <Text size="xs" color="--color-text-secondary">
              {subtitle}
            </Text>
          )}
        </VStack>
        {showBulkActions && (
          <HStack gap="sm">
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
      <HStack gap="md" wrap justifyContent="flex-start">
        {children}
      </HStack>

      {/* Error */}
      {error && (
        <Text size="sm" color="--color-status-error-fg" backgroundColor="--color-status-error-bg" padding="sm" borderRadius="element">
          {error}
        </Text>
      )}
    </VStack>
  );
};

export default StepContainer;
