import type { Policy, PolicySet, CreatePolicyRequest, UpdatePolicyRequest } from '../types';

const API_BASE = 'http://localhost:3000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Policy API
export const policyApi = {
  list(): Promise<Policy[]> {
    return fetchJson<Policy[]>(`${API_BASE}/policies`);
  },

  get(id: number): Promise<Policy> {
    return fetchJson<Policy>(`${API_BASE}/policies/${id}`);
  },

  create(data: CreatePolicyRequest): Promise<Policy> {
    return fetchJson<Policy>(`${API_BASE}/policies`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: UpdatePolicyRequest): Promise<Policy> {
    return fetchJson<Policy>(`${API_BASE}/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number): Promise<void> {
    return fetchJson<void>(`${API_BASE}/policies/${id}`, {
      method: 'DELETE',
    });
  },
};

// PolicySet API
export const policySetApi = {
  list(): Promise<PolicySet[]> {
    return fetchJson<PolicySet[]>(`${API_BASE}/policy-sets`);
  },

  get(id: number): Promise<PolicySet> {
    return fetchJson<PolicySet>(`${API_BASE}/policy-sets/${id}`);
  },

  create(data: { name: string; description: string | null }): Promise<PolicySet> {
    return fetchJson<PolicySet>(`${API_BASE}/policy-sets`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  setActive(id: number): Promise<PolicySet> {
    return fetchJson<PolicySet>(`${API_BASE}/policy-sets/${id}/activate`, {
      method: 'POST',
    });
  },
};
