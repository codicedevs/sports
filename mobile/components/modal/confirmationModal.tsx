import { Button, Div, Overlay, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  declineText?: string;
  title: string;
  subTitle: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  declineText = "Cancelar",
  title,
  subTitle,
}) => {
  return (
    <Overlay visible={isVisible} p={customTheme.spacing.small} h={scale(200)}>
      <Div h={"50%"} alignItems="center" justifyContent="center">
        <Text fontSize={customTheme.fontSize.large}>{title}</Text>
        <Text mt={scale(5)} fontSize={customTheme.fontSize.medium}>
          {subTitle}
        </Text>
      </Div>
      <Div h={"50%"} justifyContent="space-around" flexDir="row">
        <Button
          alignSelf="center"
          bg={customTheme.colors.accent}
          color="white"
          w={scale(120)}
          onPress={onConfirm}
        >
          <Text
            color="white"
            fontSize={customTheme.fontSize.small}
            fontFamily={customTheme.fontFamily.bold}
            letterSpacing={scale(1)}
          >
            {confirmText}
          </Text>
        </Button>
        <Button
          alignSelf="center"
          bg="white"
          color="white"
          underlayColor="red600"
          w={scale(120)}
          onPress={onCancel}
          borderWidth={scale(1)}
          borderColor={customTheme.colors.secondary}
        >
          <Text
            color="white"
            fontSize={customTheme.fontSize.small}
            fontFamily={customTheme.fontFamily.bold}
            letterSpacing={scale(1)}
          >
            {declineText}
          </Text>
        </Button>
      </Div>
    </Overlay>
  );
};
