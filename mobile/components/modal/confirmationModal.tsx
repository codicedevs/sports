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
    subTitle: string
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isVisible, onConfirm, onCancel, confirmText = 'Confirmar', declineText = 'Cancelar', title, subTitle }) => {
    return (
        <Overlay visible={isVisible} p={customTheme.spacing.small} h={scale(200)} >
            <Div h={'50%'} alignItems="center" justifyContent="center" >
                <Text fontSize={customTheme.fontSize.large}>{title}</Text>
                <Text mt={scale(5)} fontSize={customTheme.fontSize.medium}>{subTitle}</Text>
            </Div>
            <Div h={'50%'} justifyContent="space-around" flexDir="row">
                <Button
                    alignSelf="center"
                    onPress={onConfirm}
                    bg="green600"
                    color="white"
                >
                    <Text color="white" fontSize={customTheme.fontSize.small}>{confirmText}</Text>
                </Button>
                <Button
                    bg="red500"
                    color="white"
                    underlayColor="red600" alignSelf="center"
                    onPress={onCancel}
                >
                    <Text color="white" fontSize={customTheme.fontSize.small}>{declineText}</Text>
                </Button>
            </Div>
        </Overlay>
    )
}