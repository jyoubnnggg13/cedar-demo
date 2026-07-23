import React, { useState, useCallback, useEffect } from 'react';
import type { Policy, CreatePolicyRequest, PolicySet } from '../../types';
import { policyApi, policySetApi } from '../../api/policyApi';

interface PolicyEditorProps {
  policy?: Policy;
  onSave?: (policy: Policy) => void;
  onCancel?: () => void;
}

const emptyPolicy: CreatePolicyRequest = {
  policy_set_id: null,
  name: '',
  description: null,
  effect: 'permit',
  principal_types: null,
  resource_types: null,
  actions: null,
  conditions: null,
};

export function PolicyEditor({ policy, onSave, onCancel }: PolicyEditorProps) {
  const [form, setForm] = useState<CreatePolicyRequest>(
    policy
      ? {
          policy_set_id: policy.policy_set_id,
          name: policy.name,
          description: policy.description,
          effect: policy.effect,
          principal_types: policy.principal_types,
          resource_types: policy.resource_types,
          actions: policy.actions,
          conditions: policy.conditions,
        }
      : emptyPolicy
  );

  const [policySets, setPolicySets] = useState<PolicySet[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    policySetApi.list().then(setPolicySets).catch(console.error);
  }, []);

  const handleChange = useCallback(
    <K extends keyof CreatePolicyRequest>(field: K, value: CreatePolicyRequest[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Policy name is required';
    }
    if (!form.effect || !['permit', 'deny'].includes(form.effect)) {
      newErrors.effect = 'Effect must be permit or deny';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        let result: Policy;
        if (policy?.id) {
          result = await policyApi.update(policy.id, form);
        } else {
          result = await policyApi.create(form);
        }
        setIsDirty(false);
        onSave?.(result);
      } catch (err) {
        console.error('Failed to save policy:', err);
        setErrors({ _form: 'Failed to save policy. Please try again.' });
      } finally {
        setIsSaving(false);
      }
    },
    [form, policy?.id, validate, onSave]
  );

  const handleDelete = useCallback(async () => {
    if (!policy?.id) return;
    if (!window.confirm('Are you sure you want to delete this policy?')) return;

    try {
      await policyApi.delete(policy.id);
      onCancel?.();
    } catch (err) {
      console.error('Failed to delete policy:', err);
      setErrors({ _form: 'Failed to delete policy. Please try again.' });
    }
  }, [policy?.id, onCancel]);

  return (
    <form onSubmit={handleSubmit} className="policy-editor">
      <h2>{policy?.id ? 'Edit Policy' : 'Create Policy'}</h2>

      {errors._form && <div className="error-banner">{errors._form}</div>}

      <div className="form-group">
        <label htmlFor="name">Policy Name *</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., AllowUsersToReadDocuments"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={form.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value || null)}
          placeholder="Describe what this policy does"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label htmlFor="effect">Effect *</label>
        <select
          id="effect"
          value={form.effect}
          onChange={(e) => handleChange('effect', e.target.value as 'permit' | 'deny')}
          className={errors.effect ? 'error' : ''}
        >
          <option value="permit">Permit</option>
          <option value="deny">Deny</option>
        </select>
        {errors.effect && <span className="error-message">{errors.effect}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="policy_set_id">Policy Set</label>
        <select
          id="policy_set_id"
          value={form.policy_set_id ?? ''}
          onChange={(e) =>
            handleChange('policy_set_id', e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">None (Standalone Policy)</option>
          {policySets.map((ps) => (
            <option key={ps.id} value={ps.id}>
              {ps.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="policy-conditions">
        <legend>Policy Conditions</legend>

        <div className="form-group">
          <label htmlFor="principal_types">Principal Types</label>
          <input
            id="principal_types"
            type="text"
            value={form.principal_types ?? ''}
            onChange={(e) => handleChange('principal_types', e.target.value || null)}
            placeholder='e.g., ["User", "Admin"] (JSON array)'
          />
          <span className="hint">JSON array of principal type names</span>
        </div>

        <div className="form-group">
          <label htmlFor="resource_types">Resource Types</label>
          <input
            id="resource_types"
            type="text"
            value={form.resource_types ?? ''}
            onChange={(e) => handleChange('resource_types', e.target.value || null)}
            placeholder='e.g., ["Document", "Folder"] (JSON array)'
          />
          <span className="hint">JSON array of resource type names</span>
        </div>

        <div className="form-group">
          <label htmlFor="actions">Actions</label>
          <input
            id="actions"
            type="text"
            value={form.actions ?? ''}
            onChange={(e) => handleChange('actions', e.target.value || null)}
            placeholder='e.g., ["read", "write"] (JSON array)'
          />
          <span className="hint">JSON array of action names</span>
        </div>

        <div className="form-group">
          <label htmlFor="conditions">Conditions (Cedar Expression)</label>
          <textarea
            id="conditions"
            value={form.conditions ?? ''}
            onChange={(e) => handleChange('conditions', e.target.value || null)}
            placeholder='e.g., {"operator":"==","left":{"attr":"owner"},"right":{"val":"context.user.id"}}'
            rows={4}
          />
          <span className="hint">JSON-encoded Cedar condition expression</span>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" disabled={isSaving || (!isDirty && !!policy)}>
          {isSaving ? 'Saving...' : policy?.id ? 'Update Policy' : 'Create Policy'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        {policy?.id && (
          <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            disabled={isSaving}
          >
            Delete
          </button>
        )}
      </div>

      {isDirty && (
        <div className="unsaved-indicator">You have unsaved changes</div>
      )}
    </form>
  );
}
