/**
 * Playground Page
 * 
 * 메인 Playground 레이아웃:
 * - 좌측 사이드바: Policy List
 * - 우측 메인 콘텐츠: Policy Editor / Test Panel 전환
 * - 하단: Result Display
 */

import { useState, useCallback } from "react";
import { useTheme, Badge } from "@astryxdesign/core";
import { PolicyList } from "../components/PolicyList";
import { PolicyEditor } from "../components/PolicyEditor";
import { TestPanel } from "../components/TestPanel";
import type { Policy } from "../types/policy";

/**
 * Playground Page View Modes
 */
type PlaygroundView = "editor" | "test";

/**
 * Playground Page Props
 */
export interface PlaygroundProps {
  // 초기 선택 정책
  initialPolicy?: Policy;
}

/**
 * Playground Page Component
 */
export const Playground: React.FC<PlaygroundProps> = ({ initialPolicy }) => {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);

  // State
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(initialPolicy || null);
  const [activeView, setActiveView] = useState<PlaygroundView>("test");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Handle policy selection from sidebar
  const handlePolicySelect = useCallback((policy: Policy) => {
    setSelectedPolicy(policy);
    setActiveView("editor");
    setIsCreatingNew(false);
  }, []);

  // Handle new policy creation
  const handleNewPolicy = useCallback(() => {
    setSelectedPolicy(null);
    setActiveView("editor");
    setIsCreatingNew(true);
  }, []);

  // Handle policy save
  const handleSavePolicy = useCallback(async (cedarJson: string, name: string) => {
    console.log("Saving policy:", { name, cedarJson });

    // API 호출 로직
    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          cedarJson,
          description: `Forbid 정책 - ${name}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Policy saved:", data);
        alert(`정책 "${name}"이(가) 저장되었습니다!`);
        setSelectedPolicy(data.policy);
        setIsCreatingNew(false);
      } else {
        // API가 없으면 Mock으로 처리
        console.warn("API not available, simulating save");
        alert(`정책 "${name}"이(가) 저장되었습니다! (데모 모드)`);
        setIsCreatingNew(false);
      }
    } catch (error) {
      // API가 없으면 Mock으로 처리
      console.warn("API not available, simulating save:", error);
      alert(`정책 "${name}"이(가) 저장되었습니다! (데모 모드)`);
      setIsCreatingNew(false);
    }
  }, []);

  // Handle policy edit
  const handlePolicyEdit = useCallback((policy: Policy) => {
    setSelectedPolicy(policy);
    setActiveView("editor");
    setIsCreatingNew(false);
  }, []);

  // Handle policy delete
  const handlePolicyDelete = useCallback(async (policyId: string) => {
    if (!confirm("이 정책을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: "DELETE",
      });

      if (response.ok || response.status === 404) {
        alert("정책이 삭제되었습니다.");
        if (selectedPolicy?.id === policyId) {
          setSelectedPolicy(null);
        }
      } else {
        console.warn("API not available, simulating delete");
        alert("정책이 삭제되었습니다. (데모 모드)");
        if (selectedPolicy?.id === policyId) {
          setSelectedPolicy(null);
        }
      }
    } catch (error) {
      console.warn("API not available, simulating delete:", error);
      alert("정책이 삭제되었습니다. (데모 모드)");
      if (selectedPolicy?.id === policyId) {
        setSelectedPolicy(null);
      }
    }
  }, [selectedPolicy]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setSelectedPolicy(null);
    setIsCreatingNew(false);
    setActiveView("test");
  }, []);

  // Styles
  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    backgroundColor: t("--color-background-body"),
  };

  const sidebarStyle: React.CSSProperties = {
    width: "300px",
    flexShrink: 0,
    height: "100%",
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    backgroundColor: t("--color-background-surface"),
    borderBottom: `1px solid ${t("--color-border")}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    margin: 0,
  };

  const tabContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.25rem",
    padding: "0.5rem 1.5rem",
    backgroundColor: t("--color-background-surface"),
    borderBottom: `1px solid ${t("--color-border")}`,
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.625rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? t("--color-accent") : t("--color-text-secondary"),
    backgroundColor: "transparent",
    border: "none",
    borderBottom: isActive ? `2px solid ${t("--color-accent")}` : "2px solid transparent",
    cursor: "pointer",
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto" as const,
  };

  const emptyStateStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: t("--color-text-secondary"),
    textAlign: "center",
  };

  const emptyStateTitleStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    marginBottom: "0.5rem",
  };

  const emptyStateButtonStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: t("--radius-element"),
    border: "none",
    backgroundColor: t("--color-accent"),
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      {/* Policy List Sidebar */}
      <div style={sidebarStyle}>
        <PolicyList
          selectedPolicyId={selectedPolicy?.id}
          onPolicySelect={handlePolicySelect}
          onPolicyEdit={handlePolicyEdit}
          onPolicyDelete={handlePolicyDelete}
          onNewPolicy={handleNewPolicy}
        />
      </div>

      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {selectedPolicy
              ? selectedPolicy.name
              : isCreatingNew
              ? "새 정책 만들기"
              : "Playground"}
          </h1>
          {selectedPolicy && !isCreatingNew && (
            <Badge variant="info" label="선택됨" />
          )}
        </div>

        {/* Tab Navigation */}
        <div style={tabContainerStyle}>
          <button
            style={tabStyle(activeView === "editor")}
            onClick={() => setActiveView("editor")}
          >
            Policy Editor
          </button>
          <button
            style={tabStyle(activeView === "test")}
            onClick={() => setActiveView("test")}
          >
            Test Panel
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeView === "editor" ? (
            selectedPolicy || isCreatingNew ? (
              <PolicyEditor
                initialData={
                  selectedPolicy
                    ? parseCedarJson(selectedPolicy.cedarJson)
                    : undefined
                }
                onSave={handleSavePolicy}
                onCancel={handleCancel}
              />
            ) : (
              <div style={emptyStateStyle}>
                <p style={emptyStateTitleStyle}>편집할 정책을 선택하세요</p>
                <p>사이드바에서 정책을 선택하거나 새 정책을 만드세요.</p>
                <button style={emptyStateButtonStyle} onClick={handleNewPolicy}>
                  + 새 정책 만들기
                </button>
              </div>
            )
          ) : (
            <TestPanel />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Cedar JSON 파싱 헬퍼
 */
function parseCedarJson(cedarJson: string): {
  principal?: { role: "admin" | "editor" | "viewer" };
  resource?: { type: "document" | "issue" };
  action?: "read" | "write" | "delete";
  condition?: { expression: string; description: string };
} | undefined {
  try {
    const parsed = JSON.parse(cedarJson);
    if (parsed.condition && !parsed.condition.description) {
      parsed.condition.description = parsed.condition.expression;
    }
    return parsed as ReturnType<typeof parseCedarJson>;
  } catch {
    return undefined;
  }
}

export default Playground;
