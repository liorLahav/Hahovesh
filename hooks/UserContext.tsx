import { auth } from '@/FirebaseConfig';
import { checkAuthState } from '@/services/login';
import { getUserByPhoneNumber } from '@/services/users';
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
}
export const UserContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({} as User);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    };

    return (
        <UserContext.Provider value={{ user, changeUser, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = use(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};