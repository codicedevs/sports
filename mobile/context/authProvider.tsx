import React, { FC, ReactNode, useState } from "react";
import { ModalContext } from "./modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";

export const AuthContext = React.createContext<{
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  protect: (callback: any) => any;
}>({
  currentUser: "null",
  setCurrentUser: () => {},
  isModalVisible: false,
  showModal: () => {},
  hideModal: () => {},
  protect: (callback) => () => {},
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
  const [open, setOpen] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  function protect(callback: Function) {
    console.log(currentUser);
    
    if(currentUser) {
      return callback
    } else {
      showModal()
      return () => {}
    }
  };

  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isModalVisible,
        showModal,
        hideModal,
        protect
      }}
    >
      <ModalContext.Provider value={{ open, setOpen }}>
        {children}
      </ModalContext.Provider>
      <MatchModalHandler open={open} setOpen={setOpen} />
    </AuthContext.Provider>
  );
};

export default AppProvider;
