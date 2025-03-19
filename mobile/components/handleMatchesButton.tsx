import React from "react";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppScreens } from "../navigation/screens";
import { useSession } from "../context/authProvider";
import { useModal } from "../context/createMatchProvider";

const HandleMatchesButton = () => {
const navigation = useNavigation()
    return (
        <Div w={"100%"} h={175} flexDir="row">
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate(AppScreens.MATCH_SCREEN)}>
                <ImageBackground style={{ flex: 1 }} source={require("../assets/match/InicioLeft.jpg")}>
                    <Div p={customTheme.spacing.medium}>
                        <Text fontFamily="NotoSans-BoldItalic" color="white" fontSize={customTheme.fontSize.large} >BUSCAR{"\n"}PARTIDOS</Text>
                    </Div>
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} >
                <ImageBackground style={{ flex: 1,justifyContent:"flex-end" }} source={require("../assets/match/InicioRight.jpg")}>
                    <Div p={customTheme.spacing.medium}>
                        <Text color="white" fontFamily="NotoSans-BoldItalic" fontSize={customTheme.fontSize.large}>ORGANIZAR{"\n"}PARTIDOS</Text>
                    </Div>
                </ImageBackground>
            </TouchableOpacity>
        </Div>
    );
};


export default HandleMatchesButton;
