import { useState, useEffect } from "react";

export interface Policy {
  id: number;
  name: string;
  description: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const response = await fetch("/api/policies");
        if (!response.ok) {
          throw new Error(`Failed to fetch policies: ${response.statusText}`);
        }
        const data = await response.json();
        setPolicies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchPolicies();
  }, []);

  return { policies, loading, error };
}
