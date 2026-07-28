/**
 * TestPanel Component
 * 
 * Authorization testing panel that allows users to configure and evaluate
 * authorization requests against the Cedar policy engine.
 */

import { useState, useCallback, useEffect } from "react";
import { useTheme, TextInput, Selector, Badge, Button, CheckboxInput, Heading, VStack, HStack, Text } from "@astryxdesign/core";
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

  // Styles removed - using Astryx components directly

  return (
    <VStack
      gap="lg"
      padding="lg"
      borderRadius="container"
      backgroundColor="--color-background-surface"
      border="1px solid --color-border"
    >
      {/* Header */}
      <HStack gap="md" justifyContent="space-between" alignItems="center">
        <Heading level={2} size="xl" fontWeight="semibold" color="--color-text-primary">
          Authorization Test
        </Heading>
        <Badge variant="blue" label="Playground" />
      </HStack>

      {/* Request Configuration */}
      <VStack gap="md">
        <Heading level={3} size="sm" fontWeight="semibold" color="--color-text-primary">
          Request Configuration
        </Heading>

        {/* Principal */}
        <VStack gap="sm">
          <Text size="xs" fontWeight="medium" color="--color-text-secondary" textTransform="uppercase" letterSpacing="wider">
            Principal
          </Text>
          <HStack gap="md" wrap>
            <VStack gap="xs" style={{ flex: 1, minWidth: "200px" }}>
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
            </VStack>
            <VStack gap="xs" style={{ flex: 1, minWidth: "200px" }}>
              <Selector
                label="User ID"
                value={principalId}
                onChange={(value) => setPrincipalId(value)}
                options={SAMPLE_USERS[principalRole]?.map((userId) => ({ value: userId, label: userId })) || []}
                size="sm"
                isLabelHidden
              />
            </VStack>
          </HStack>
        </VStack>

        {/* Resource */}
        <VStack gap="sm">
          <Text size="xs" fontWeight="medium" color="--color-text-secondary" textTransform="uppercase" letterSpacing="wider">
            Resource
          </Text>
          <HStack gap="md" wrap>
            <VStack gap="xs" style={{ flex: 1, minWidth: "200px" }}>
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
            </VStack>
            <VStack gap="xs" style={{ flex: 1, minWidth: "200px" }}>
              <Selector
                label="Resource ID"
                value={resourceId}
                onChange={(value) => setResourceId(value)}
                options={SAMPLE_RESOURCES[resourceType]?.map((resource) => ({ value: resource.id, label: resource.id })) || []}
                size="sm"
                isLabelHidden
              />
            </VStack>
          </HStack>
          {/* Resource Attributes (readonly) */}
          <HStack gap="md" wrap>
            <VStack gap="xs" style={{ flex: 1, minWidth: "120px" }}>
              <TextInput
                label="Owner"
                value={currentResource?.ownerId || "-"}
                isDisabled
                isLabelHidden
              />
            </VStack>
            <VStack gap="xs" style={{ flex: 1, minWidth: "120px" }}>
              <TextInput
                label="isPublic"
                value={currentResource?.attributes?.isPublic?.toString() || "false"}
                isDisabled
                isLabelHidden
              />
            </VStack>
          </HStack>
        </VStack>

        {/* Action */}
        <VStack gap="sm">
          <Text size="xs" fontWeight="medium" color="--color-text-secondary" textTransform="uppercase" letterSpacing="wider">
            Action
          </Text>
          <HStack gap="md" wrap>
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
      <VStack gap="sm">
        <Button
          label={loading ? "Evaluating..." : "Evaluate Request"}
          variant="primary"
          onClick={handleEvaluate}
          isDisabled={loading || selectedActions.size === 0}
          isLoading={loading}
          style={{ width: "100%" }}
        />
        {selectedActions.size === 0 && (
          <Text size="sm" color="--color-status-warning-fg" backgroundColor="--color-status-warning-bg" padding="sm" borderRadius="element">
            최소 1개의 액션을 선택해주세요.
          </Text>
        )}
      </VStack>

      {/* Error Display */}
      {error && (
        <Text size="sm" color="--color-status-error-fg" backgroundColor="--color-status-error-bg" padding="sm" borderRadius="element">
          {error}
        </Text>
      )}

      {/* Result Display */}
      <VStack gap="md" alignItems="stretch">
        <Heading level={3} size="sm" fontWeight="semibold" color="--color-text-primary">
          Result
        </Heading>
        <ResultDisplay result={result} />
      </VStack>
    </VStack>
  );
}
