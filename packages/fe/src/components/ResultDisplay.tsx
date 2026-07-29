/**
 * ResultDisplay Component
 * 
 * Displays the authorization evaluation result with visual badges.
 */

import { Badge, Text, VStack } from "@astryxdesign/core";
import type { EvaluateResponse } from "../types/evaluation";

interface ResultDisplayProps {
  result: EvaluateResponse | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return null;
  }

  const isAllow = result.decision === "ALLOW";

  return (
    <VStack gap={1} style={{ paddingTop: "var(--spacing-1)" }}>
      <Badge
        variant={isAllow ? "success" : "error"}
        label={result.decision}
        icon={isAllow ? "✓" : "✗"}
      />

      {isAllow ? (
        <VStack
          gap={1}
          padding={2}
          style={{ backgroundColor: "var(--color-background-muted)", borderRadius: "var(--radius-element)", border: "1px solid var(--color-border)" }}
        >
          <Text size="sm" color="secondary">
            모든 Forbid 정책이 미매칭 → 요청이 허용됩니다
          </Text>
        </VStack>
      ) : (
        <VStack
          gap={2}
          padding={2}
          style={{ backgroundColor: "var(--color-background-muted)", borderRadius: "var(--radius-element)", border: "1px solid var(--color-border)" }}
        >
          <VStack gap={1}>
            <Text size="sm" color="secondary">매칭된 정책</Text>
            <Text size="base" weight="medium" color="primary">
              {result.matchedPolicy || "-"}
            </Text>
          </VStack>
          {result.reason && (
            <VStack gap={1}>
              <Text size="sm" color="secondary">이유</Text>
              <Text size="base" weight="medium" color="primary">
                {result.reason}
              </Text>
            </VStack>
          )}
        </VStack>
      )}
    </VStack>
  );
}
