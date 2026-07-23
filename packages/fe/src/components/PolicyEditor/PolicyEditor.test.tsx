import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PolicyEditor } from './PolicyEditor';
import type { Policy } from '../../types';

// Mock API
vi.mock('../../api/policyApi', () => ({
  policyApi: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  policySetApi: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

describe('PolicyEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create mode', () => {
    it('renders empty form for new policy', () => {
      render(<PolicyEditor />);
      expect(screen.getByRole('heading', { name: 'Create Policy' })).toBeInTheDocument();
      expect(screen.getByLabelText('Policy Name *')).toHaveValue('');
      expect(screen.getByLabelText('Effect *')).toHaveValue('permit');
    });

    it('validates required name field', async () => {
      render(<PolicyEditor />);
      const submitButton = screen.getByRole('button', { name: /create policy/i });
      fireEvent.click(submitButton);
      expect(await screen.findByText('Policy name is required')).toBeInTheDocument();
    });

    it('allows filling in all form fields', () => {
      render(<PolicyEditor />);
      fireEvent.change(screen.getByLabelText('Policy Name *'), {
        target: { value: 'TestPolicy' },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'Test description' },
      });
      fireEvent.change(screen.getByLabelText('Effect *'), {
        target: { value: 'deny' },
      });
      expect(screen.getByLabelText('Policy Name *')).toHaveValue('TestPolicy');
      expect(screen.getByLabelText('Description')).toHaveValue('Test description');
      expect(screen.getByLabelText('Effect *')).toHaveValue('deny');
    });
  });

  describe('Edit mode', () => {
    const mockPolicy: Policy = {
      id: 1,
      policy_set_id: null,
      name: 'ExistingPolicy',
      description: 'Existing description',
      effect: 'deny',
      principal_types: '["User"]',
      resource_types: '["Document"]',
      actions: '["read"]',
      conditions: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('renders form with existing policy data', () => {
      render(<PolicyEditor policy={mockPolicy} />);
      expect(screen.getByRole('heading', { name: 'Edit Policy' })).toBeInTheDocument();
      expect(screen.getByLabelText('Policy Name *')).toHaveValue('ExistingPolicy');
      expect(screen.getByLabelText('Effect *')).toHaveValue('deny');
      expect(screen.getByLabelText('Principal Types')).toHaveValue('["User"]');
    });

    it('shows delete button in edit mode', () => {
      render(<PolicyEditor policy={mockPolicy} />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('Unsaved changes indicator', () => {
    it('shows indicator when form is dirty', () => {
      render(<PolicyEditor />);
      expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('Policy Name *'), {
        target: { value: 'Modified' },
      });
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });
});
