import React from "react";
import { Text } from "react-native";
import { Overlay, Button, Div } from "react-native-magnus";
import { useSession } from "../../context/authProvider";
import { customTheme } from "../../utils/theme";
import authService from "../../service/auth.service";
import { useMutate } from "../../hooks/useMutate";
//En useSession agregue un showModal, en los lugares que no debe poder accederse sin usuario se debe preguntar si hay un currentUser y si no hay se hace un showModal() 
const RestrictiveModal = () => {
    const { isModalVisible, hideModal, setCurrentUser } = useSession();

    // GoogleSignin.configure();
    // const handleGoogleSignIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const userInfo = await GoogleSignin.signIn();
    //         const res = await authService.loginSSO(userInfo)
    //         if (res) {
    //             setCurrentUser(res)
    //             hideModal()
    //         }
    //     } catch (e) {
    //         console.log(e, 'Ocurrio un error ')
    //     }
    //     console.log("Google Sign-In process ended"); // Log final
    // };

    const login = async () => {
        try{
            const res = await authService.login("orefici.diego+1@gmail.com", "12345678")
            console.log('res', res)
            // setCurrentUser(res.user)
            if(res){
                hideModal()
            }
        } catch(e){
            console.log(e)
        }
    }

    const loginQuery = useMutate(login, (res) =>{ setCurrentUser(res.user)}, (err) => {console.error(err)})

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
                {/* <GoogleSigninButton
                    style={{ width: "100%", height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={handleGoogleSignIn}
                /> */}
                <Button
                    alignSelf="center"
                    px="xl"
                    bg="blue600"
                    color="white"
                    onPress={hideModal}
                >
                    Cerrar
                </Button>
                <Button
                    alignSelf="center"
                    px="xl"
                    bg="blue600"
                    color="white"
                    onPress={loginQuery}
                >
                    Iniciar Sesion
                </Button>
            </Div>
        </Div>
    );
};

export default RestrictiveModal;
