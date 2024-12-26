import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { Overlay, Button, Div } from "react-native-magnus";
import { useSession } from "../../context/authProvider";
import { customTheme } from "../../utils/theme";

const RestrictiveModal = () => {
    const { isModalVisible, hideModal } = useSession();

    if (!isModalVisible) return
    return (
        <Div
            position="absolute"
            bg="rgba(0, 0, 0, 0.5)"
            top={0}
            bottom={0}
            left={0}
            right={0}
            zIndex={1000}
            alignItems="center"
            justifyContent="center"
            p={10}
        >
            <Div
                w="100%"
                p="xl"
                rounded="md"
                bg="white"
                alignItems="center"
                justifyContent="center"
            >
                <Text style={{ fontSize: customTheme.fontSize.medium, textAlign: "center", marginBottom: 15 }}>
                    ¡Debes iniciar sesión para acceder a esta funcionalidad!
                </Text>
                <Button
                    alignSelf="center"
                    px="xl"
                    bg="blue600"
                    color="white"
                    onPress={hideModal}
                >
                    Cerrar
                </Button>
            </Div>
        </Div>
    );
};

export default RestrictiveModal;
