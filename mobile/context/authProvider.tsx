import React, { FC, ReactNode, useState } from "react";
import { ModalContext } from "./modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";

export const AuthContext = React.createContext<{
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
}>({
  currentUser: "null",
  setCurrentUser: () => {},
  isModalVisible: false,
  showModal: () => {},
  hideModal: () => {},
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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};

export default AppProvider;
