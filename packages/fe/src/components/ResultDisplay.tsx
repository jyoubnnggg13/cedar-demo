/**
 * ResultDisplay Component
 * 
 * Displays the authorization evaluation result with visual badges.
 */

import { useTheme, Badge, Text, VStack } from "@astryxdesign/core";
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

  return (
    <VStack gap="sm" paddingTop="sm">
      <Badge
        variant={isAllow ? "success" : "error"}
        label={result.decision}
        icon={isAllow ? "✓" : "✗"}
      />

      {isAllow ? (
        <VStack
          gap="sm"
          padding="md"
          backgroundColor="--color-background-muted"
          borderRadius="element"
          border="1px solid --color-border"
        >
          <Text size="sm" color="--color-text-secondary">
            모든 Forbid 정책이 미매칭 → 요청이 허용됩니다
          </Text>
        </VStack>
      ) : (
        <VStack
          gap="md"
          padding="md"
          backgroundColor="--color-background-muted"
          borderRadius="element"
          border="1px solid --color-border"
        >
          <VStack gap="xs">
            <Text size="sm" color="--color-text-secondary">매칭된 정책</Text>
            <Text size="base" fontWeight="medium" color="--color-text-primary">
              {result.matchedPolicy || "-"}
            </Text>
          </VStack>
          {result.reason && (
            <VStack gap="xs">
              <Text size="sm" color="--color-text-secondary">이유</Text>
              <Text size="base" fontWeight="medium" color="--color-text-primary">
                {result.reason}
              </Text>
            </VStack>
          )}
        </VStack>
      )}
    </VStack>
  );
}
