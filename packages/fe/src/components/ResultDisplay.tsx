/**
 * ResultDisplay Component
 * 
 * Displays the authorization evaluation result with visual badges.
 */

import { useTheme, Badge, VStack, Text, Section } from "@astryxdesign/core";
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

  // Styles - Astryx components use spacing props instead of inline styles

  return (
    <VStack marginTop="1rem" alignItems="stretch" gap="1rem">
      <Badge
        variant={isAllow ? "success" : "error"}
        label={result.decision}
        icon={isAllow ? "✓" : "✗"}
      />

      {isAllow ? (
        <Section
          padding="1rem"
          backgroundColor={t("--color-background-muted")}
          borderRadius={t("--radius-element")}
          border={`1px solid ${t("--color-border")}`}
        >
          <Text size="sm" color="secondary">
            모든 Forbid 정책이 미매칭 → 요청이 허용됩니다
          </Text>
        </Section>
      ) : (
        <Section
          padding="1rem"
          backgroundColor={t("--color-background-muted")}
          borderRadius={t("--radius-element")}
          border={`1px solid ${t("--color-border")}`}
        >
          <VStack alignItems="stretch" gap="0.75rem">
            <VStack alignItems="stretch">
              <Text size="sm" color="secondary">매칭된 정책</Text>
              <Text size="base" weight="medium">{result.matchedPolicy || "-"}</Text>
            </VStack>
            {result.reason && (
              <VStack alignItems="stretch">
                <Text size="sm" color="secondary">이유</Text>
                <Text size="base" weight="medium">{result.reason}</Text>
              </VStack>
            )}
          </VStack>
        </Section>
      )}
    </VStack>
  );
}
