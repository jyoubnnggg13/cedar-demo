import React, { useState } from "react";
import { PolicyList } from "../components/ui/Sidebar";
import { Tabs } from "../components/ui/Tabs";
import { PolicyEditor } from "../components/PolicyEditor";
import { TestPanel } from "../components/TestPanel";
import { ResultDisplay } from "../components/ResultDisplay";
import { usePolicies } from "../hooks/usePolicies";
import type { Policy } from "../hooks/usePolicies";

export function Playground() {
  const { policies, loading: policiesLoading, error: policiesError } = usePolicies();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<
    | { decision: "Permit" | "Deny"; reason?: string; errors?: string[] }
    | undefined
  >(undefined);

  const handleSelectPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleNewPolicy = () => {
    setSelectedPolicy({
      id: 0,
      name: "New Policy",
      description: "",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleEvaluate = async () => {
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policy_id: selectedPolicy?.id,
          content: selectedPolicy?.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation failed: ${response.statusText}`);
      }

      const result = await response.json();
      setEvaluationResult(result);
    } catch (error) {
      setEvaluationResult({
        decision: "Deny",
        reason: "Evaluation failed",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    }
  };

  const editorTab = {
    id: "editor",
    label: "Policy Editor",
    content: <PolicyEditor policy={selectedPolicy} onSave={setSelectedPolicy} />,
  };

  const testTab = {
    id: "test",
    label: "Test Panel",
    content: (
      <TestPanel onEvaluate={handleEvaluate} result={evaluationResult} />
    ),
  };

  return (
    <div className="playground">
      <aside className="playground-sidebar">
        <PolicyList
          policies={policies}
          selectedPolicyId={selectedPolicy?.id}
          onSelectPolicy={handleSelectPolicy}
          onNewPolicy={handleNewPolicy}
          loading={policiesLoading}
        />
      </aside>
      <main className="playground-main">
        <Tabs tabs={[editorTab, testTab]} defaultTab="editor" />
      </main>
      <footer className="playground-footer">
        <ResultDisplay result={evaluationResult} />
      </footer>
    </div>
  );
}
