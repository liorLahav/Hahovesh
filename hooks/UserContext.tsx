import { auth } from '@/FirebaseConfig';
import { checkAuthState } from '@/services/login';
import { getUserByPhoneNumber, updatePermissions } from '@/services/users';
import { set, update } from 'firebase/database';
import { createContext, use, useEffect, useState } from 'react';
export type User = {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    permissions: string[];
}

type userContextType = {
    user: User;
    changeUser: (phoneNumber: string) => Promise<void>;
    isAuthenticated: boolean;
    userLoading: boolean;
    userHasRoles: (roleToCheck: string) => boolean;
    updateRoles: (permissions: string[]) => void;
}
export const UserContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({} as User);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const checkIfAuthenticated = async () => {
            try {
                const user = await checkAuthState();
                if (user) {
                    changeUser(user.phoneNumber);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error checking authentication state:", error);
                setIsAuthenticated(false);
            }
        }
        checkIfAuthenticated();
    }, []);

    const changeUser =async (phoneNumber : string) => {
        try{
            setUserLoading(true);
            const userData = await getUserByPhoneNumber(phoneNumber);
            if (userData) {
                setUser(userData as User);
                setIsAuthenticated(true);
            } else {
                console.error("User not found");
                setIsAuthenticated(false);
            }
            console.log("User data updated:", userData);
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            setIsAuthenticated(false);
        }
        setUserLoading(false);
    };
    const refreshUser = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await changeUser(user.phoneNumber);
            } else {
                console.error("No user is currently authenticated");
                setIsAuthenticated(false);
            }
        }
        catch (error) {
            console.error("Error refreshing user data:", error);
            setIsAuthenticated(false);
        }
    }
    const userHasRoles = (roleToCheck: string) => {
        return user.permissions.includes(roleToCheck)
    }
    const updateRoles = async (permissions: string[]) => {
        const prevPremissions = user.permissions || [];
        setUser((prevUser) => ({
            ...prevUser,
            permissions: permissions,
        }));
        try{
            updatePermissions(user.id, permissions);
        }
        catch (error) {
            console.error("Error updating user permissions:", error);
            setUser((prevUser) => ({
                ...prevUser,
                permissions: prevPremissions,
            }));
        }
    };

    return (
        <UserContext.Provider value={{userLoading, user, changeUser, isAuthenticated,userHasRoles,updateRoles }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const context = use(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};