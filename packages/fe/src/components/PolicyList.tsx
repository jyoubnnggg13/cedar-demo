/**
 * PolicyList Component
 * 
 * Sidebar component for displaying the list of policies with API integration.
 */

import { useState, useEffect, useCallback } from "react";
import { useTheme, Button, TextInput, VStack, HStack, Heading, Text, Banner, ClickableCard } from "@astryxdesign/core";
import type { Policy } from "../types/policy";

interface PolicyListProps {
  selectedPolicyId?: string;
  onPolicySelect?: (policy: Policy) => void;
  onPolicyEdit?: (policy: Policy) => void;
  onPolicyDelete?: (policyId: string) => void;
  onNewPolicy?: () => void;
}

/**
 * PolicyList Component
 */
export const PolicyList: React.FC<PolicyListProps> = ({
  selectedPolicyId,
  onPolicySelect,
  onPolicyEdit,
  onPolicyDelete,
  onNewPolicy,
}) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  // State
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch policies from API
  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/policies");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (err) {
      // If API is not available, use mock data for demo
      console.warn("API not available, using mock data:", err);
      setPolicies(getMockPolicies());
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Filter policies by search term
  const filteredPolicies = policies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle new policy button
  const handleNewPolicy = () => {
    if (onNewPolicy) {
      onNewPolicy();
    }
  };

  // Styles - Astryx components use spacing props instead of inline styles

  // Mock data for demo
  function getMockPolicies(): Policy[] {
    return [
      {
        id: "policy-001",
        name: "Admin Document Access",
        cedarJson: '{"effect":"forbid","principal":{"role":"admin"},"resource":{"type":"document"},"action":"delete"}',
        description: "관리자 문서 삭제 제한",
        createdAt: "2026-07-24T09:00:00Z",
        updatedAt: "2026-07-24T09:00:00Z",
      },
      {
        id: "policy-002",
        name: "Viewer Read Only",
        cedarJson: '{"effect":"forbid","principal":{"role":"viewer"},"resource":{"type":"document"},"action":"write"}',
        description: "뷰어 쓰기 제한",
        createdAt: "2026-07-23T14:30:00Z",
        updatedAt: "2026-07-23T14:30:00Z",
      },
      {
        id: "policy-003",
        name: "Issue Editor Restriction",
        cedarJson: '{"effect":"forbid","principal":{"role":"editor"},"resource":{"type":"issue"},"action":"delete"}',
        description: "편집자 이슈 삭제 제한",
        createdAt: "2026-07-22T10:15:00Z",
        updatedAt: "2026-07-22T10:15:00Z",
      },
    ];
  }

  return (
    <VStack
      height="100%"
      alignItems="stretch"
      backgroundColor={t("--color-background-surface")}
      borderRight={`1px solid ${t("--color-border")}`}
    >
      {/* Header */}
      <VStack
        padding="1rem"
        alignItems="stretch"
        gap="0.75rem"
        borderBottom={`1px solid ${t("--color-border")}`}
      >
        <Heading level={3} size="sm">Policies</Heading>
        <TextInput
          label="Search Policies"
          placeholder="정책 검색..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          isLabelHidden
          size="sm"
        />
        <Button
          label="+ 새 정책"
          variant="primary"
          onClick={handleNewPolicy}
          style={{ width: "100%" }}
        />
      </VStack>

      {/* List */}
      <VStack
        flex={1}
        overflow="auto"
        padding="1rem"
        alignItems="stretch"
        gap="0.5rem"
      >
        {loading && (
          <VStack padding="2rem 1rem" alignItems="center">
            <Text color="secondary">로딩 중...</Text>
          </VStack>
        )}

        {error && (
          <Banner variant="error" margin="1rem">{error}</Banner>
        )}

        {!loading && !error && filteredPolicies.length === 0 && (
          <VStack padding="2rem 1rem" alignItems="center" gap="0.5rem">
            <Text color="secondary">정책이 없습니다.</Text>
            <Text size="sm" color="secondary">
              "새 정책" 버튼을 클릭하여 첫 번째 정책을 만드세요.
            </Text>
          </VStack>
        )}

        {!loading &&
          !error &&
          filteredPolicies.map((policy) => (
            <PolicyListItem
              key={policy.id}
              policy={policy}
              isSelected={policy.id === selectedPolicyId}
              onClick={() => onPolicySelect?.(policy)}
              onEdit={onPolicyEdit ? () => onPolicyEdit(policy) : undefined}
              onDelete={onPolicyDelete ? () => onPolicyDelete(policy.id) : undefined}
            />
          ))}
      </VStack>
    </VStack>
  );
};

/**
 * Policy list item component
 */
interface PolicyListItemProps {
  policy: Policy;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PolicyListItem: React.FC<PolicyListItemProps> = ({
  policy,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  return (
    <ClickableCard
      padding="0.875rem 1rem"
      borderRadius={t("--radius-element")}
      backgroundColor={isSelected ? t("--color-accent") : "transparent"}
      borderColor={isSelected ? t("--color-accent") : "transparent"}
      onClick={onClick}
    >
      <VStack alignItems="stretch" gap="0.25rem">
        <Text
          size="sm"
          weight="medium"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          color={isSelected ? "white" : "primary"}
        >
          {policy.name}
        </Text>
        <Text
          size="xs"
          color={isSelected ? "white" : "secondary"}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          opacity={isSelected ? 0.8 : 1}
        >
          {new Date(policy.createdAt).toLocaleDateString()} • {policy.description || "설명 없음"}
        </Text>
        {(onEdit || onDelete) && (
          <HStack gap="0.25rem" marginTop="0.5rem" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                label="수정"
                variant="ghost"
                size="sm"
                onClick={onEdit}
              />
            )}
            {onDelete && (
              <Button
                label="삭제"
                variant="ghost"
                size="sm"
                onClick={onDelete}
              />
            )}
          </HStack>
        )}
      </VStack>
    </ClickableCard>
  );
};
