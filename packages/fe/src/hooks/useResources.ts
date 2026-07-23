import { useState, useEffect } from "react";

export interface Resource {
  id: number;
  type: string;
  name: string;
  attributes: Record<string, unknown>;
}

export function useResources(typeFilter?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const url = typeFilter
          ? `/api/resources?type=${encodeURIComponent(typeFilter)}`
          : "/api/resources";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [typeFilter]);

  return { resources, loading, error };
}
