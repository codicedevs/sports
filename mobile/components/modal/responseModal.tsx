import { MotiView } from "moti";
import React, { useEffect } from "react";
import { Div, Icon, Overlay, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";

interface ResponseModalProps {
  status: "success" | "error";
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  status,
  isVisible,
  setIsVisible,
  message,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getColor = () => {
    return status === "success" ? "green600" : "red600";
  };

  const getIconName = () => {
    return status === "success" ? "checkcircleo" : "closecircleo";
  };

  return (
    <Overlay
      h={scale(150)}
      visible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      p="none"
      w={"80%"}
    >
      <Div h={"70%"} alignItems="center" justifyContent="center">
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Icon color={getColor()} fontSize={scale(50)} name={getIconName()} />
        </MotiView>
      </Div>
      <Div h={"30%"} alignItems="center" justifyContent="flex-start">
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 2000, delay: 1000 }}
        >
          <Text fontSize={customTheme.fontSize.medium} fontWeight="600">
            {message}
          </Text>
        </MotiView>
      </Div>
    </Overlay>
  );
};

export default ResponseModal;
