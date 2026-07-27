/**
 * TestPanel Component
 * 
 * Authorization testing panel that allows users to configure and evaluate
 * authorization requests against the Cedar policy engine.
 */

import { useState, useCallback, useEffect } from "react";
import { useTheme, TextInput, Selector } from "@astryxdesign/core";
import { useEvaluate } from "../hooks/useEvaluate";
import { ResultDisplay } from "./ResultDisplay";
import type { Principal, Resource, EvaluateRequest, EvaluateResponse } from "../types/evaluation";

/**
 * Sample data for the dropdowns
 */
const SAMPLE_USERS: Record<string, string[]> = {
  admin: ["user-admin", "admin-001"],
  editor: ["user-editor", "editor-001"],
  viewer: ["user-viewer", "viewer-001"],
};

const SAMPLE_RESOURCES: Record<string, { id: string; ownerId: string; attributes: Resource["attributes"] }[]> = {
  document: [
    { id: "doc-001", ownerId: "user-admin", attributes: { isPublic: true, author: "admin" } },
    { id: "doc-002", ownerId: "user-admin", attributes: { isPublic: false, author: "admin" } },
    { id: "doc-003", ownerId: "user-editor", attributes: { isPublic: true, author: "editor" } },
  ],
  issue: [
    { id: "issue-001", ownerId: "user-admin", attributes: { author: "admin" } },
    { id: "issue-002", ownerId: "user-viewer", attributes: { author: "viewer" } },
  ],
};

const ACTIONS: Array<{ value: "read" | "write" | "delete"; label: string }> = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
];

export function TestPanel() {
  const theme = useTheme();
  const t = (name: string) => theme.token(name);
  const { evaluate, loading, error } = useEvaluate();

  // Form state
  const [principalRole, setPrincipalRole] = useState<Principal["role"]>("viewer");
  const [principalId, setPrincipalId] = useState<string>("user-viewer");
  const [resourceType, setResourceType] = useState<Resource["type"]>("document");
  const [resourceId, setResourceId] = useState<string>("doc-001");
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set(["read"]));

  // Result state
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  // Get current resource details
  const currentResource = SAMPLE_RESOURCES[resourceType]?.find((r) => r.id === resourceId);

  // Update principal ID when role changes
  useEffect(() => {
    const users = SAMPLE_USERS[principalRole];
    if (users && users.length > 0) {
      setPrincipalId(users[0]);
    }
  }, [principalRole]);

  // Update resource ID when type changes
  useEffect(() => {
    const resources = SAMPLE_RESOURCES[resourceType];
    if (resources && resources.length > 0) {
      setResourceId(resources[0].id);
    }
  }, [resourceType]);

  const handleActionToggle = useCallback((action: string) => {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(action)) {
        next.delete(action);
      } else {
        next.add(action);
      }
      return next;
    });
  }, []);

  const handleEvaluate = useCallback(async () => {
    if (selectedActions.size === 0) {
      return;
    }

    // Use the first selected action for evaluation
    const action = Array.from(selectedActions)[0] as "read" | "write" | "delete";

    const request: EvaluateRequest = {
      principal: {
        role: principalRole,
        id: principalId,
      },
      resource: {
        type: resourceType,
        id: resourceId,
        ownerId: currentResource?.ownerId || "unknown",
        attributes: currentResource?.attributes,
      },
      action,
    };

    const response = await evaluate(request);
    setResult(response);
  }, [principalRole, principalId, resourceType, resourceId, currentResource, selectedActions, evaluate]);

  // Styles
  const panelStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderRadius: t("--radius-container"),
    backgroundColor: t("--color-background-surface"),
    border: `1px solid ${t("--color-border")}`,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: `1px solid ${t("--color-border")}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: t("--text-heading-1-size"),
    fontWeight: Number(t("--text-heading-1-weight")),
    color: t("--color-text-primary"),
    margin: 0,
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    padding: "0.25rem 0.5rem",
    borderRadius: t("--radius-inner"),
    backgroundColor: t("--color-accent"),
    color: "white",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: t("--color-text-primary"),
    marginBottom: "0.75rem",
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t("--color-text-secondary"),
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };



  const checkboxGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    color: t("--color-text-primary"),
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: t("--radius-element"),
    border: "none",
    backgroundColor: t("--color-accent"),
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: `background-color ${theme.tokens["--duration-fast"] || "150ms"}`,
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: t("--radius-element"),
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "0.875rem",
  };

  return (
    <div style={panelStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Authorization Test</h2>
        <span style={badgeStyle}>Playground</span>
      </header>

      {/* Request Configuration */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Request Configuration</h3>

        {/* Principal */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Principal</label>
          <div style={fieldGroupStyle}>
            <div style={fieldStyle}>
              <Selector
                label="Role"
                value={principalRole}
                onChange={(value) => setPrincipalRole(value as Principal["role"])}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "editor", label: "Editor" },
                  { value: "viewer", label: "Viewer" },
                ]}
                size="sm"
                isLabelHidden
              />
            </div>
            <div style={fieldStyle}>
              <Selector
                label="User ID"
                value={principalId}
                onChange={(value) => setPrincipalId(value)}
                options={SAMPLE_USERS[principalRole]?.map((userId) => ({ value: userId, label: userId })) || []}
                size="sm"
                isLabelHidden
              />
            </div>
          </div>
        </div>

        {/* Resource */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Resource</label>
          <div style={fieldGroupStyle}>
            <div style={fieldStyle}>
              <Selector
                label="Type"
                value={resourceType}
                onChange={(value) => setResourceType(value as Resource["type"])}
                options={[
                  { value: "document", label: "Document" },
                  { value: "issue", label: "Issue" },
                ]}
                size="sm"
                isLabelHidden
              />
            </div>
            <div style={fieldStyle}>
              <Selector
                label="Resource ID"
                value={resourceId}
                onChange={(value) => setResourceId(value)}
                options={SAMPLE_RESOURCES[resourceType]?.map((resource) => ({ value: resource.id, label: resource.id })) || []}
                size="sm"
                isLabelHidden
              />
            </div>
          </div>
          {/* Resource Attributes (readonly) */}
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <TextInput
                label="Owner"
                value={currentResource?.ownerId || "-"}
                isDisabled
                isLabelHidden
              />
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <TextInput
                label="isPublic"
                value={currentResource?.attributes?.isPublic?.toString() || "false"}
                isDisabled
                isLabelHidden
              />
            </div>
          </div>
        </div>

        {/* Action */}
        <div>
          <label style={labelStyle}>Action</label>
          <div style={checkboxGroupStyle}>
            {ACTIONS.map((action) => (
              <label key={action.value} style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={selectedActions.has(action.value)}
                  onChange={() => handleActionToggle(action.value)}
                />
                <span>{action.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluate Button */}
      <div>
        <button
          onClick={handleEvaluate}
          disabled={loading || selectedActions.size === 0}
          style={buttonStyle}
        >
          {loading ? "Evaluating..." : "Evaluate Request"}
        </button>
        {selectedActions.size === 0 && (
          <p style={{ ...errorStyle, backgroundColor: "#fef3c7", borderColor: "#fcd34d", color: "#92400e", marginTop: "0.5rem" }}>
            최소 1개의 액션을 선택해주세요.
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Result Display */}
      <div>
        <h3 style={{ ...sectionTitleStyle, marginTop: "1.5rem" }}>Result</h3>
        <ResultDisplay result={result} />
      </div>
    </div>
  );
}
