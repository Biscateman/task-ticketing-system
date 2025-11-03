import { createContext, PropsWithChildren, useState } from "react";

type AuthState = {
    isLoggedIn: boolean;
    token: string | null;
    userRole: string;
    setIsLoggedIn: (loggedIn: boolean) => void;
    setToken: (token: string | null) => void;
    setUserRole: (role: string) => void;
};

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    token: null,
    userRole: '',
    setIsLoggedIn: () => { },
    setToken: () => { },
    setUserRole: () => { }
});

export function AuthProvider({ children }: PropsWithChildren) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('');

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, userRole, setIsLoggedIn, setToken, setUserRole }}>
            {children}
        </AuthContext.Provider>
    )
}