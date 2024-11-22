import { Button, Div, Modal, Overlay } from "react-native-magnus";
import { modalType } from "./modal.type";
import { scale, verticalScale } from "react-native-size-matters";

type DinamicModalProps = {
    type: modalType;
    isOpen: boolean;
    children: React.ReactNode;
    setOpen: (open: boolean) => void;
};

const DinamicModal = ({
    type,
    isOpen,
    children,
    setOpen,
}: DinamicModalProps) => {
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
                    <Div maxH={verticalScale(200)} h={verticalScale(200)}>{children}</Div>
                    <Div
                        position="absolute"
                        bottom={verticalScale(-200)}
                        left={scale(10)}
                        right={scale(10)}
                        justifyContent="center"
                    >
                        <Button
                            onPress={() => setOpen(false)}
                            alignSelf="center"
                            color="blue"
                        >
                            Cerrar
                        </Button>
                    </Div>
                </Div>
            </Overlay>
        )
    );
};

export default DinamicModal;
