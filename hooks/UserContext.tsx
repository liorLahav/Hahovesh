import { auth } from '@/FirebaseConfig';
import { signOutUser } from '@/services/auth';
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
    signOut: () => Promise<void>;
}
export const UserContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({} as User);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    useEffect(() => {
        const checkIfAuthenticated = async () => {
            console.log("Checking authentication state...");
            try {
                const user = await checkAuthState();
                console.log("User authentication state:", user);
                if (user) {
                    changeUser(user.phoneNumber);
                    setIsAuthenticated(true);
                    console.log("User is authenticated:", isAuthenticated);
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
            console.log("Changing user with phone number:", phoneNumber);
            const userData = await getUserByPhoneNumber(phoneNumber);
            if (userData) {
                setUser(userData as User);
                setIsAuthenticated(true);
            } else {
                console.error("User not found 1");
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
            console.log("user: ",user);
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

    const signOut = async () => {
            console.log("Signing out user...");
            signOutUser();
            setUser({} as User);
            setIsAuthenticated(false);
            setUserLoading(false);
    }
            

    return (
        <UserContext.Provider value={{userLoading, user, changeUser, isAuthenticated,userHasRoles,updateRoles,signOut }}>
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