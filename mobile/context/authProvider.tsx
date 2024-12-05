import React, { FC, ReactNode, useEffect, useState } from "react";
import userService from "../service/user.service";
import registerForPushNotificationsAsync from "../notifications/pushNotifications";

export const AuthContext = React.createContext<{
  currentUser: any;
  setCurrentUser: (user: any) => void;
  pushToken: string | null;
}>({
  currentUser: "null",
  setCurrentUser: () => {},
  pushToken: null,
});

interface AppProviderProps {
  children: ReactNode;
}

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerPushToken = async () => {
      if (currentUser) {
        // Solo registramos el token si hay un usuario autenticado
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setPushToken(token);
          await userService.updatePushToken(currentUser._id, token); // Enviamos el pushToken al backend
        }
      }
    };

    registerPushToken();
  }, [currentUser]); // Se ejecuta cada vez que cambia el usuario

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        pushToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AppProvider;
