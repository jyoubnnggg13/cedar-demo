import React from "react";
import { useTheme, Button, VStack, HStack, Heading, Text, Section, Banner } from "@astryxdesign/core";

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

  // Styles - Astryx components use spacing props instead of inline styles

  return (
    <Section
      padding="1.5rem"
      borderRadius={t("--radius-element")}
      backgroundColor={t("--color-background-surface")}
      border={`1px solid ${error ? "#ef4444" : t("--color-border")}`}
    >
      <VStack alignItems="stretch" gap="1rem">
        <HStack alignItems="center" justifyContent="space-between" flexWrap gap="0.5rem">
          <VStack alignItems="stretch" gap="0.25rem">
            <Heading level={3} size="md">{title}</Heading>
            {subtitle && <Text size="xs" color="secondary">{subtitle}</Text>}
          </VStack>
          {showBulkActions && (
            <HStack gap="0.5rem">
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
        <HStack gap="1rem" flexWrap>
          {children}
        </HStack>
        {error && (
          <Banner variant="error">{error}</Banner>
        )}
      </VStack>
    </Section>
  );
};

export default StepContainer;
