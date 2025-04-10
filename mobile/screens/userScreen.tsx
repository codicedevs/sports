import { Button, Div, Image, Text } from "react-native-magnus";
import { useSession } from "../context/authProvider";
import { customTheme } from "../utils/theme";
import { scale } from "react-native-size-matters";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { useState } from "react";

const UserScreen = () => {
    const { currentUser } = useSession();
    const [open, setOpen] = useState(false)

    const getInitials = (name: string): string => {
        return name
            .trim()
            .split(/\s+/) // separa por espacios
            .map(word => word.slice(0, 1)) // toma las 2 primeras letras de cada palabra
            .join('')
            .toUpperCase(); // opcional, si querés que siempre esté en mayúsculas
    };

    function handleModal() {
        setOpen(!open)
    };

    return (
        <Div flex={1} bg="white" alignItems="center" p={20}>
            <MatchPreferencesModal open={open} setOpen={handleModal}/>
            <Div
                w={scale(70)}
                h={scale(70)}
                bg={customTheme.colors.primary}
                rounded="circle"
                alignItems="center"
                justifyContent="center"
                mb={40}
            >
                <Text fontSize={customTheme.fontSize.xl} fontFamily={customTheme.fontFamily.bold}>{getInitials(currentUser.name)}</Text>
            </Div>
            <Div flexDir="row" justifyContent="space-between" w={'100%'} p={10}>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium}>Nombre:</Text>
                </Div>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium} fontFamily={customTheme.fontFamily.bold}>{currentUser.name}</Text>
                </Div>
            </Div>
            <Div flexDir="row" justifyContent="space-between" w={'100%'} p={10}>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium}>Edad:</Text>
                </Div>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium} fontFamily={customTheme.fontFamily.bold}>30</Text>
                </Div>
            </Div>
            <Div flexDir="row" justifyContent="space-between" w={'100%'} p={10}>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium}>Email:</Text>
                </Div>
                <Div>
                    <Text fontSize={customTheme.fontSize.medium} fontFamily={customTheme.fontFamily.bold}>{currentUser.email}</Text>
                </Div>
            </Div>
            <Div mt={scale(35)}>
                <Button
                    bg="white"
                    block
                    borderColor="black"
                    borderWidth={1}
                    onPress={handleModal}
                >
                    <Image
                        source={require("../assets/searchEngine.png")}
                        style={{
                            width: scale(25),
                            height: scale(25),
                            resizeMode: "contain",
                            tintColor: "black",
                        }}
                    />
                    <Text
                        fontSize={customTheme.fontSize.medium}
                        fontFamily="NotoSans-BoldItalic"
                        ml={customTheme.spacing.small}
                        color="black"
                    >
                        Preferencias de partidos.
                    </Text>
                </Button>
            </Div>
        </Div>
    );
};

export default UserScreen;
