/**
 * PolicyList Component
 * 
 * Sidebar component for displaying the list of policies with API integration.
 */

import { useState, useEffect, useCallback } from "react";
import { Button, TextInput, VStack, HStack, Text, Heading, Card } from "@astryxdesign/core";
import type { Policy } from "../types/policy";

interface PolicyListProps {
  selectedPolicyId?: string;
  onPolicySelect?: (policy: Policy) => void;
  onPolicyEdit?: (policy: Policy) => void;
  onPolicyDelete?: (policyId: string) => void;
  onNewPolicy?: () => void;
}

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
  return (
    <Card
      padding={2}
      variant={isSelected ? "blue" : "default"}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      onClick={onClick}
    >
      <VStack gap={1} align="stretch">
        <Text size="sm" weight="medium" color={isSelected ? "accent" : "primary"}>
          {policy.name}
        </Text>
        <Text size="xsm" color={isSelected ? "accent" : "secondary"}>
          {new Date(policy.createdAt).toLocaleDateString()} • {policy.description || "설명 없음"}
        </Text>
        {(onEdit || onDelete) && (
          <HStack gap={1} onClick={(e) => e.stopPropagation()}>
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
    </Card>
  );
};

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
      gap={0}
      align="stretch"
      style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "var(--color-background-surface)", borderRight: "1px solid var(--color-border)" }}
    >
      {/* Header */}
      <VStack gap={2} padding={2} align="stretch" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <Heading level={3} color="primary">
          Policies
        </Heading>
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
        gap={1}
        padding={2}
        align="stretch"
        style={{ flex: 1, overflowY: "auto" }}
      >
        {loading && (
          <VStack gap={2} padding={4} align="center">
            <Text size="sm" color="secondary">로딩 중...</Text>
          </VStack>
        )}

        {error && (
          <VStack gap={1} padding={2} align="stretch" style={{ backgroundColor: "var(--color-status-error-bg)", borderRadius: "var(--radius-element)" }}>
            <Text size="sm" color="accent">{error}</Text>
          </VStack>
        )}

        {!loading && !error && filteredPolicies.length === 0 && (
          <VStack gap={2} padding={4} align="center">
            <Text size="sm" color="secondary">정책이 없습니다.</Text>
            <Text size="xsm" color="secondary">
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
