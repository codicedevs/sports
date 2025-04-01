import React, { FC, ReactNode, useState } from "react";
import { ModalContext } from "./modalProvider";

export const AuthContext = React.createContext<{
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  pushToken: string | null;
  setPushToken: (token: string) => void;
}>({
  currentUser: "null",
  setCurrentUser: () => {},
  isModalVisible: false,
  showModal: () => {},
  hideModal: () => {},
  pushToken: null,
  setPushToken: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in an <AuthProvider />");
    }
  }
  return value;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isModalVisible,
        showModal,
        hideModal,
        pushToken,
        setPushToken,
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};

export default AppProvider;
``