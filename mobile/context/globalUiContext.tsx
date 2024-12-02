import React, {
    createContext,
    ReactNode,
    useContext,
    useRef,
    useState,
  } from "react";
  import { Snackbar } from "react-native-magnus";
  import ResponseModal from "../components/modal/responseModal";
  
  type StatusType = "success" | "error";
  
  interface GlobalUIContextProps {
    showSnackBar: (status: StatusType, message: string) => void;
    showModal: (status: StatusType, message: string) => void;
  }
  
  interface GlobalUIProviderProps {
    children: ReactNode;
  }
  
  const GlobalUIContext = createContext<GlobalUIContextProps>({
    showSnackBar: () => {},
    showModal: () => {},
  });
  
  export const useGlobalUI = () => {
    return useContext(GlobalUIContext);
  };
  
  export const GlobalUIProvider:React.FC<GlobalUIProviderProps> = ({ children }) => {
    const snackbarRef = useRef<Snackbar>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalStatus, setModalStatus] = useState<StatusType>("success");
  
    const showSnackBar = (status: StatusType, message: string) => {
      const bgColor = status === "success" ? "green700" : "red700";
      snackbarRef.current?.show(message, { bg: bgColor, color: "white" });
    };
  
    const showModal = (status: StatusType, message: string) => {
      setModalStatus(status);
      setModalMessage(message);
      setModalVisible(true);
    };
  
    return (
      <GlobalUIContext.Provider value={{ showSnackBar, showModal }}>
        {children}
        <Snackbar ref={snackbarRef} duration={5000} />
        <ResponseModal
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          status={modalStatus}
          message={modalMessage}
        />
      </GlobalUIContext.Provider>
    );
  };
  