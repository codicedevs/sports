import React, { FC, ReactNode, useState } from "react";

export const AuthContext = React.createContext<{
    currentUser: any;
    setCurrentUser: (user: any) => void;
}>({
    currentUser: 'null',
    setCurrentUser: () => { }
})

interface AppProviderProps {
    children: ReactNode;
}

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<any>(null)

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AppProvider;
