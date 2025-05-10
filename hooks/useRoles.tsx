// DELETE THIS FILE
// This file is not used in the project.

import { useEffect, useState } from "react";
import { getRoles } from "@/services/users";

export function useRoles(userId: string) {
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log("Fetching roles for user:", userId); // Debugging
        const rolesData = await getRoles(userId);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [userId]);

  return { roles, loading };
}
