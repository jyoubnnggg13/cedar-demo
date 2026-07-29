import React, { useState, useMemo, useCallback } from "react";
import { useTheme, TextInput, TextArea, CodeBlock, Button, VStack, HStack, Heading } from "@astryxdesign/core";
import { StepperProgress } from "./StepperProgress";
import { SelectableCard } from "./SelectionCard";
import { StepContainer } from "./StepContainer";
import type {
  CedarPolicy,
  PolicyFormState,
  Step,
  StepValidation,
} from "../types/policy";

/**
 * PolicyEditor Props
 */
export interface PolicyEditorProps {
  onSave?: (cedarJson: string, name: string) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<CedarPolicy>;
}

/**
 * PolicyEditor 컴포넌트
 * Forbid 정책을 편집하는 Stepper 기반 폼 인터페이스
 */
export const PolicyEditor: React.FC<PolicyEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const theme = useTheme();

  // 스텝 정의
  const steps: Step[] = [
    { id: 1, title: "Principal", required: true, description: "역할 선택" },
    { id: 2, title: "Resource", required: true, description: "리소스 유형 선택" },
    { id: 3, title: "Action", required: true, description: "작업 선택 (다중)" },
    { id: 4, title: "Condition", required: false, description: "조건 입력 (선택)" },
  ];

  // 폼 상태
  const [formState, setFormState] = useState<PolicyFormState>({
    name: "",
    principalRole: initialData?.principal?.role || null,
    resourceType: initialData?.resource?.type || null,
    actions: initialData?.action ? [initialData.action] : [],
    conditionExpression: initialData?.condition?.expression || "",
    conditionDescription: initialData?.condition?.description || "",
  });

  // 현재 스텝
  const [currentStep, setCurrentStep] = useState(0);

  // 완료된 스텝
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 저장 상태
  const [isSaving, setIsSaving] = useState(false);

  // 에러 메시지
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Principal 옵션
  const principalOptions = [
    { value: "admin" as const, label: "Admin", description: "전체 권한" },
    { value: "editor" as const, label: "Editor", description: "편집 권한" },
    { value: "viewer" as const, label: "Viewer", description: "조회 권한" },
  ];

  // Resource 옵션
  const resourceOptions = [
    { value: "document" as const, label: "Document", description: "문서 리소스" },
    { value: "issue" as const, label: "Issue", description: "이슈 리소스" },
  ];

  // Action 옵션
  const actionOptions = [
    { value: "read" as const, label: "Read", description: "읽기 작업" },
    { value: "write" as const, label: "Write", description: "쓰기 작업" },
    { value: "delete" as const, label: "Delete", description: "삭제 작업" },
  ];

  // 스텝 유효성 검사
  const validateStep = useCallback((stepIndex: number): StepValidation => {
    switch (stepIndex) {
      case 0:
        if (!formState.name.trim()) {
          return { isValid: false, error: "정책 이름을 입력하세요" };
        }
        if (formState.name.length > 100) {
          return { isValid: false, error: "정책 이름은 100자 이내여야 합니다" };
        }
        if (!formState.principalRole) {
          return { isValid: false, error: "Principal 역할을 선택하세요" };
        }
        return { isValid: true };
      case 1:
        if (!formState.resourceType) {
          return { isValid: false, error: "Resource 유형을 선택하세요" };
        }
        return { isValid: true };
      case 2:
        if (formState.actions.length === 0) {
          return { isValid: false, error: "최소 하나 이상의 Action을 선택하세요" };
        }
        return { isValid: true };
      case 3:
        return { isValid: true };
      default:
        return { isValid: true };
    }
  }, [formState]);

  // 전체 유효성 검사
  const isAllValid = useMemo(() => {
    return (
      formState.name.trim().length > 0 &&
      formState.name.length <= 100 &&
      formState.principalRole !== null &&
      formState.resourceType !== null &&
      formState.actions.length > 0
    );
  }, [formState]);

  // Cedar JSON 생성
  const cedarJson = useMemo(() => {
    const policy: CedarPolicy = {
      effect: "forbid",
      principal: {
        role: formState.principalRole || "viewer",
      },
      resource: {
        type: formState.resourceType || "document",
      },
      action: formState.actions[0] || "read",
    };

    if (formState.conditionExpression.trim()) {
      policy.condition = {
        expression: formState.conditionExpression,
        description: formState.conditionDescription || formState.conditionExpression,
      };
    }

    return JSON.stringify(policy, null, 2);
  }, [formState]);

  // Principal 선택
  const handlePrincipalSelect = (value: "admin" | "editor" | "viewer") => {
    setFormState((prev) => ({ ...prev, principalRole: value }));
    setErrors((prev) => ({ ...prev, 0: "" }));
  };

  // Resource 선택
  const handleResourceSelect = (value: "document" | "issue") => {
    setFormState((prev) => ({ ...prev, resourceType: value }));
    setErrors((prev) => ({ ...prev, 1: "" }));
  };

  // Action 토글
  const handleActionToggle = (value: "read" | "write" | "delete") => {
    setFormState((prev) => {
      const exists = prev.actions.includes(value);
      return {
        ...prev,
        actions: exists
          ? prev.actions.filter((a) => a !== value)
          : [...prev.actions, value],
      };
    });
    setErrors((prev) => ({ ...prev, 2: "" }));
  };

  // 전체 Action 선택
  const handleSelectAllActions = () => {
    setFormState((prev) => ({
      ...prev,
      actions: actionOptions.map((a) => a.value),
    }));
    setErrors((prev) => ({ ...prev, 2: "" }));
  };

  // 전체 Action 해제
  const handleSelectNoneActions = () => {
    setFormState((prev) => ({ ...prev, actions: [] }));
  };

  // 다음 스텝
  const handleNext = () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [currentStep]: validation.error || "" }));
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 이전 스텝
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 스텝 클릭
  const handleStepClick = (index: number) => {
    if (index <= currentStep || completedSteps.includes(index)) {
      setCurrentStep(index);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!isAllValid) {
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(cedarJson, formState.name);
      }
      // 폼 초기화
      setFormState({
        name: "",
        principalRole: null,
        resourceType: null,
        actions: [],
        conditionExpression: "",
        conditionDescription: "",
      });
      setCurrentStep(0);
      setCompletedSteps([]);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Error status for inputs
  const inputErrorStatus = errors[0] ? { type: 'error' as const, message: errors[0] } : undefined;

  // 스텝 콘텐츠 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                label="Policy Name"
                value={formState.name}
                onChange={(value) => {
                  setFormState((prev) => ({ ...prev, name: value }));
                  setErrors((prev) => ({ ...prev, 0: "" }));
                }}
                placeholder="정책 이름을 입력하세요"
                isRequired
                status={inputErrorStatus}
              />
            </div>
            <StepContainer
              title="Principal (Role)"
              subtitle="역할을 선택하세요"
              error={errors[0]}
              onSelectAll={() => {}}
              onSelectNone={() => {}}
            >
              {principalOptions.map((option) => (
                <SelectableCard
                  key={option.value}
                  label={option.label}
                  isSelected={formState.principalRole === option.value}
                  onChange={(isSelected) => isSelected && handlePrincipalSelect(option.value)}
                >
                  <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.token("--color-text-primary") }}>{option.label}</span>
                    {option.description && <span style={{ fontSize: "0.75rem", color: theme.token("--color-text-secondary") }}>{option.description}</span>}
                  </div>
                </SelectableCard>
              ))}
            </StepContainer>
          </div>
        );

      case 1:
        return (
          <StepContainer
            title="Resource Type"
            subtitle="리소스 유형을 선택하세요"
            error={errors[1]}
            onSelectAll={() => {}}
            onSelectNone={() => {}}
          >
            {resourceOptions.map((option) => (
              <SelectableCard
                key={option.value}
                label={option.label}
                isSelected={formState.resourceType === option.value}
                onChange={(isSelected) => isSelected && handleResourceSelect(option.value)}
              >
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.token("--color-text-primary") }}>{option.label}</span>
                  {option.description && <span style={{ fontSize: "0.75rem", color: theme.token("--color-text-secondary") }}>{option.description}</span>}
                </div>
              </SelectableCard>
            ))}
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="Action"
            subtitle="작업을 선택하세요 (다중 선택 가능)"
            showBulkActions
            error={errors[2]}
            onSelectAll={handleSelectAllActions}
            onSelectNone={handleSelectNoneActions}
          >
            {actionOptions.map((option) => (
              <SelectableCard
                key={option.value}
                label={option.label}
                isSelected={formState.actions.includes(option.value)}
                onChange={() => handleActionToggle(option.value)}
              >
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.token("--color-text-primary") }}>{option.label}</span>
                  {option.description && <span style={{ fontSize: "0.75rem", color: theme.token("--color-text-secondary") }}>{option.description}</span>}
                </div>
              </SelectableCard>
            ))}
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="Condition (선택)"
            subtitle="조건 표현식을 입력하세요 (선택사항)"
            onSelectAll={() => {}}
            onSelectNone={() => {}}
          >
            <div style={{ width: "100%" }}>
              <TextArea
                label="Condition Expression"
                value={formState.conditionExpression}
                onChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    conditionExpression: value,
                  }))
                }
                placeholder='예: resource.ownerId == principal.id'
                rows={3}
                description="조건 표현식을 입력하세요 (선택사항)"
              />
              <div style={{ marginTop: "1rem" }}>
                <TextInput
                  label="Condition Description"
                  value={formState.conditionDescription}
                  onChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      conditionDescription: value,
                    }))
                  }
                  placeholder="조건에 대한 설명을 입력하세요"
                  description="조건에 대한 설명을 입력하세요 (선택사항)"
                />
              </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <VStack
      gap={4}
      padding={4}
      style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "var(--radius-container)", backgroundColor: "var(--color-background-surface)", border: "1px solid var(--color-border)" }}
      align="stretch"
    >
      {/* Header */}
      <HStack gap={3} align="center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--spacing-2)" }}>
        <Heading level={2} color="primary">
          Policy Editor
        </Heading>
      </HStack>

      <StepperProgress
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {renderStepContent()}

      {/* Navigation */}
      <HStack gap={3} justify="between">
        <Button
          label="← Previous"
          variant="secondary"
          onClick={handlePrevious}
          isDisabled={currentStep === 0}
        />
        {currentStep < steps.length - 1 ? (
          <Button
            label="Next →"
            variant="primary"
            onClick={handleNext}
          />
        ) : (
          <div />
        )}
      </HStack>

      {/* Preview */}
      <VStack
        gap={1}
        padding={2}
        style={{ backgroundColor: "var(--color-background-muted)", borderRadius: "var(--radius-element)", border: "1px solid var(--color-border)" }}
        align="stretch"
      >
        <Heading level={3} color="primary">
          Cedar JSON Preview
        </Heading>
        <CodeBlock
          code={cedarJson}
          language="json"
          container="section"
          size="sm"
          hasCopyButton
          isWrapped
          maxHeight={200}
        />
      </VStack>

      {/* Footer */}
      <HStack gap={3} justify="between" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--spacing-2)" }}>
        <Button
          label="Cancel"
          variant="secondary"
          onClick={handleCancel}
        />
        <Button
          label={isSaving ? "Saving..." : "Save Policy"}
          variant="primary"
          onClick={handleSave}
          isDisabled={!isAllValid || isSaving}
          isLoading={isSaving}
        />
      </HStack>
    </VStack>
  );
};

export default PolicyEditor;
