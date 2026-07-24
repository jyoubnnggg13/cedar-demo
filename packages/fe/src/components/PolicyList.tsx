/**
 * PolicyList Component
 * 
 * Sidebar component for displaying the list of policies with API integration.
 */

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@astryxdesign/core";
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
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  const itemStyle: React.CSSProperties = {
    padding: "0.875rem 1rem",
    borderRadius: t("--radius-element"),
    backgroundColor: isSelected ? t("--color-accent") : "transparent",
    color: isSelected ? "white" : t("--color-text-primary"),
    cursor: "pointer",
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
    marginBottom: "0.5rem",
    border: `1px solid ${isSelected ? t("--color-accent") : "transparent"}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "0.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  const metaStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: isSelected ? "rgba(255,255,255,0.8)" : t("--color-text-secondary"),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.25rem",
    marginTop: "0.5rem",
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: "0.25rem 0.5rem",
    fontSize: "0.625rem",
    borderRadius: t("--radius-inner"),
    border: "none",
    cursor: "pointer",
    opacity: isSelected ? 0.9 : 1,
    backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : t("--color-background-muted"),
    color: isSelected ? "white" : t("--color-text-secondary"),
  };

  return (
    <div style={itemStyle} onClick={onClick}>
      <div style={titleStyle}>{policy.name}</div>
      <div style={metaStyle}>
        {new Date(policy.createdAt).toLocaleDateString()} • {policy.description || "설명 없음"}
      </div>
      {(onEdit || onDelete) && (
        <div style={actionsStyle} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button style={actionButtonStyle} onClick={onEdit}>
              수정
            </button>
          )}
          {onDelete && (
            <button style={actionButtonStyle} onClick={onDelete}>
              삭제
            </button>
          )}
        </div>
      )}
    </div>
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

  // Styles
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: t("--color-background-surface"),
    borderRight: `1px solid ${t("--color-border")}`,
  };

  const headerStyle: React.CSSProperties = {
    padding: "1rem",
    borderBottom: `1px solid ${t("--color-border")}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    marginBottom: "0.75rem",
  };

  const searchStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    borderRadius: t("--radius-element"),
    border: `1px solid ${t("--color-border")}`,
    backgroundColor: t("--color-background-body"),
    color: t("--color-text-primary"),
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const newButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: t("--radius-element"),
    border: "none",
    backgroundColor: t("--color-accent"),
    color: "white",
    cursor: "pointer",
    marginTop: "0.75rem",
    transition: `background-color ${theme.tokens["--duration-fast"] || "150ms"}`,
  };

  const listContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto" as const,
    padding: "1rem",
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "2rem 1rem",
    color: t("--color-text-secondary"),
  };

  const errorStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    margin: "1rem",
    borderRadius: t("--radius-element"),
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: "0.875rem",
  };

  const loadingStyle: React.CSSProperties = {
    padding: "2rem 1rem",
    textAlign: "center",
    color: t("--color-text-secondary"),
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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Policies</h3>
        <input
          type="text"
          placeholder="정책 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
        <button style={newButtonStyle} onClick={handleNewPolicy}>
          + 새 정책
        </button>
      </div>

      <div style={listContainerStyle}>
        {loading && <div style={loadingStyle}>로딩 중...</div>}

        {error && <div style={errorStyle}>{error}</div>}

        {!loading && !error && filteredPolicies.length === 0 && (
          <div style={emptyStateStyle}>
            <p>정책이 없습니다.</p>
            <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
              "새 정책" 버튼을 클릭하여 첫 번째 정책을 만드세요.
            </p>
          </div>
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
      </div>
    </div>
  );
};
