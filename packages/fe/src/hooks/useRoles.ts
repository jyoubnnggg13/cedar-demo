import { useState, useEffect } from "react";

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch("/api/roles");
        if (!response.ok) {
          throw new Error(`Failed to fetch roles: ${response.statusText}`);
        }
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return { roles, loading, error };
}
