import React from "react";
import type { Policy } from "../../hooks/usePolicies";

export interface PolicyEditorProps {
  policy: Policy | null;
  onSave: (policy: Policy) => void;
}

export function PolicyEditor({ policy, onSave }: PolicyEditorProps) {
  const [content, setContent] = React.useState(policy?.content || "");

  React.useEffect(() => {
    setContent(policy?.content || "");
  }, [policy]);

  if (!policy) {
    return (
      <div className="policy-editor-empty">
        <p>Select a policy to edit or create a new one</p>
      </div>
    );
  }

  return (
    <div className="policy-editor">
      <div className="policy-editor-header">
        <h3>{policy.name}</h3>
      </div>
      <textarea
        className="policy-editor-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter Cedar policy here..."
      />
    </div>
  );
}
