import React, { useState, useEffect, useCallback } from 'react';
import type { Policy } from '../../types';
import { policyApi } from '../../api/policyApi';
import { PolicyEditor } from '../PolicyEditor/PolicyEditor';

export function PolicyList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadPolicies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await policyApi.list();
      setPolicies(data);
    } catch (err) {
      console.error('Failed to load policies:', err);
      setError('Failed to load policies. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const handleSave = useCallback(
    (policy: Policy) => {
      setPolicies((prev) => {
        const idx = prev.findIndex((p) => p.id === policy.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = policy;
          return next;
        }
        return [...prev, policy];
      });
      setSelectedPolicy(null);
      setIsCreating(false);
    },
    []
  );

  const handleCancel = useCallback(() => {
    setSelectedPolicy(null);
    setIsCreating(false);
  }, []);

  const handleDelete = useCallback(
    (policy: Policy) => {
      setPolicies((prev) => prev.filter((p) => p.id !== policy.id));
      if (selectedPolicy?.id === policy.id) {
        setSelectedPolicy(null);
      }
    },
    [selectedPolicy?.id]
  );

  if (loading) {
    return (
      <div className="policy-list-container">
        <div className="loading">Loading policies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policy-list-container">
        <div className="error-message">{error}</div>
        <button onClick={loadPolicies}>Retry</button>
      </div>
    );
  }

  if (isCreating || selectedPolicy) {
    return (
      <div className="policy-list-container">
        <PolicyEditor
          policy={selectedPolicy ?? undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="policy-list-container">
      <div className="policy-list-header">
        <h1>Policy Editor</h1>
        <button className="create-btn" onClick={() => setIsCreating(true)}>
          + Create Policy
        </button>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <p>No policies found.</p>
          <button className="create-btn" onClick={() => setIsCreating(true)}>
            Create Your First Policy
          </button>
        </div>
      ) : (
        <table className="policy-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Effect</th>
              <th>Policy Set</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td className="id-cell">{policy.id}</td>
                <td>
                  <div className="policy-name">{policy.name}</div>
                  {policy.description && (
                    <div className="policy-description">{policy.description}</div>
                  )}
                </td>
                <td>
                  <span className={`effect-badge effect-${policy.effect}`}>
                    {policy.effect}
                  </span>
                </td>
                <td>{policy.policy_set_id ?? '—'}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm('Delete this policy?')) {
                        policyApi.delete(policy.id).then(() => handleDelete(policy));
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
