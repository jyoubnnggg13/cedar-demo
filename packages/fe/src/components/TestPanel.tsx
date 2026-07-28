/**
 * TestPanel Component
 * 
 * Authorization testing panel that allows users to configure and evaluate
 * authorization requests against the Cedar policy engine.
 */

import { useState, useCallback, useEffect } from "react";
import { useTheme, TextInput, Selector, Badge, Button, VStack, HStack, Heading, Text, CheckboxInput, Banner } from "@astryxdesign/core";
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

  // Styles - Astryx components use spacing props instead of inline styles

  return (
    <VStack
      padding="1.5rem"
      borderRadius={t("--radius-container")}
      backgroundColor={t("--color-background-surface")}
      border={`1px solid ${t("--color-border")}`}
      alignItems="stretch"
      gap="1.5rem"
    >
      {/* Header */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="1rem"
        borderBottom={`1px solid ${t("--color-border")}`}
      >
        <Heading level={2} size="lg">Authorization Test</Heading>
        <Badge variant="blue" label="Playground" />
      </HStack>

      {/* Request Configuration */}
      <VStack alignItems="stretch" gap="1.5rem">
        <Heading level={3} size="sm">Request Configuration</Heading>

        {/* Principal */}
        <VStack alignItems="stretch" gap="0.5rem">
          <Text size="xs" weight="medium" textTransform="uppercase" letterSpacing="wider" color="secondary">Principal</Text>
          <HStack gap="1rem" flexWrap="wrap">
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
            <Selector
              label="User ID"
              value={principalId}
              onChange={(value) => setPrincipalId(value)}
              options={SAMPLE_USERS[principalRole]?.map((userId) => ({ value: userId, label: userId })) || []}
              size="sm"
              isLabelHidden
            />
          </HStack>
        </VStack>

        {/* Resource */}
        <VStack alignItems="stretch" gap="0.5rem">
          <Text size="xs" weight="medium" textTransform="uppercase" letterSpacing="wider" color="secondary">Resource</Text>
          <HStack gap="1rem" flexWrap="wrap">
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
            <Selector
              label="Resource ID"
              value={resourceId}
              onChange={(value) => setResourceId(value)}
              options={SAMPLE_RESOURCES[resourceType]?.map((resource) => ({ value: resource.id, label: resource.id })) || []}
              size="sm"
              isLabelHidden
            />
          </HStack>
          {/* Resource Attributes (readonly) */}
          <HStack gap="1rem" flexWrap="wrap" marginTop="0.75rem">
            <TextInput
              label="Owner"
              value={currentResource?.ownerId || "-"}
              isDisabled
              isLabelHidden
            />
            <TextInput
              label="isPublic"
              value={currentResource?.attributes?.isPublic?.toString() || "false"}
              isDisabled
              isLabelHidden
            />
          </HStack>
        </VStack>

        {/* Action */}
        <VStack alignItems="stretch" gap="0.5rem">
          <Text size="xs" weight="medium" textTransform="uppercase" letterSpacing="wider" color="secondary">Action</Text>
          <HStack gap="1rem" flexWrap="wrap">
            {ACTIONS.map((action) => (
              <CheckboxInput
                key={action.value}
                label={action.label}
                isChecked={selectedActions.has(action.value)}
                onChange={() => handleActionToggle(action.value)}
              />
            ))}
          </HStack>
        </VStack>
      </VStack>

      {/* Evaluate Button */}
      <VStack alignItems="stretch" gap="0.5rem">
        <Button
          label={loading ? "Evaluating..." : "Evaluate Request"}
          variant="primary"
          onClick={handleEvaluate}
          isDisabled={loading || selectedActions.size === 0}
          isLoading={loading}
          style={{ width: "100%" }}
        />
        {selectedActions.size === 0 && (
          <Banner variant="warning">
            최소 1개의 액션을 선택해주세요.
          </Banner>
        )}
      </VStack>

      {/* Error Display */}
      {error && <Banner variant="error">{error}</Banner>}

      {/* Result Display */}
      <VStack alignItems="stretch" gap="1rem">
        <Heading level={3} size="sm">Result</Heading>
        <ResultDisplay result={result} />
      </VStack>
    </VStack>
  );
}
