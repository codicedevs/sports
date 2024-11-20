import { Button, Div, Modal, Overlay } from "react-native-magnus";
import { modalType } from "./modal.type";
import { verticalScale } from "react-native-size-matters";

const DinamicModal = ({
    type,
    isOpen,
    children,
    setOpen,
}: {
    type: modalType;
    isOpen: boolean;
    children: React.ReactNode; // Mejora: tipado más claro para los hijos.
    setOpen: (open: boolean) => void; // Callback para cambiar el estado del modal.
}) => {
    return (
        type === modalType.FULL ? (
            <Modal isVisible={isOpen}>
                <Div flex={8}>
                    {children}
                </Div>
                <Div flex={2} justifyContent="center" w={"100%"}>
                    <Button onPress={() => setOpen(false)} alignSelf="center" color="blue">Cerrar</Button>
                </Div>
            </Modal>
        ) : (
            <Overlay visible={isOpen}>
                <Div>
                    {children}
                </Div>
                <Div position="absolute" bottom={verticalScale(-200)} justifyContent="center" w={"100%"}>
                    <Button  onPress={() => setOpen(false)} alignSelf="center" color="blue">Cerrar</Button>
                </Div>
            </Overlay>
        )
    );
};

export default DinamicModal;
