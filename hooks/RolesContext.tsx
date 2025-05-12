import { createContext, useContext, useState, useEffect } from "react";
import { getRoles } from "@/services/users";

type RolesContextType = {
  roles: string[];
  setRoles: (roles: string[]) => void;
  refreshRoles: () => Promise<void>;
  rolesLoading: boolean; 
};

const RolesContext = createContext<RolesContextType | null>(null);

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const userId = "Sy79iRZBzqaUey6elxmT"; // או מתוך auth
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const refreshRoles = async () => {
    const fetched = await getRoles(userId);
    setRoles(fetched);
    setRolesLoading(false);
  };

  useEffect(() => {
    refreshRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ roles, setRoles, refreshRoles, rolesLoading }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRolesContext = () => {
  const ctx = useContext(RolesContext);
  if (!ctx)
    throw new Error("useRolesContext must be used inside RolesProvider");
  return ctx;
};
