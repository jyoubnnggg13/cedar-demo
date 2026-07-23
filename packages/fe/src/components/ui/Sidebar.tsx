import React from "react";
import { Button } from "./Button";
import type { Policy } from "../../hooks/usePolicies";

export interface PolicyListProps {
  policies: Policy[];
  selectedPolicyId?: number;
  onSelectPolicy: (policy: Policy) => void;
  onNewPolicy: () => void;
  loading?: boolean;
}

export function PolicyList({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  onNewPolicy,
  loading = false,
}: PolicyListProps) {
  return (
    <div className="policy-list">
      <div className="policy-list-header">
        <h2>Policies</h2>
        <Button onClick={onNewPolicy} size="sm">
          + New Policy
        </Button>
      </div>
      <div className="policy-list-content">
        {loading ? (
          <div className="policy-list-loading">Loading...</div>
        ) : policies.length === 0 ? (
          <div className="policy-list-empty">No policies found</div>
        ) : (
          <ul className="policy-list-items">
            {policies.map((policy) => (
              <li
                key={policy.id}
                className={`policy-item ${
                  selectedPolicyId === policy.id ? "selected" : ""
                }`}
                onClick={() => onSelectPolicy(policy)}
              >
                <span className="policy-name">{policy.name}</span>
                {policy.description && (
                  <span className="policy-description">{policy.description}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
