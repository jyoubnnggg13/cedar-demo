/**
 * useEvaluate Hook
 * 
 * Hook for calling the authorization evaluation API.
 */

import { useState, useCallback } from 'react';
import type { EvaluateRequest, EvaluateResponse } from '../types/evaluation';

interface UseEvaluateResult {
  evaluate: (request: EvaluateRequest) => Promise<EvaluateResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useEvaluate(): UseEvaluateResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(async (request: EvaluateRequest): Promise<EvaluateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: EvaluateResponse = await response.json();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { evaluate, loading, error };
}
