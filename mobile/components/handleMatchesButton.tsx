import React from "react";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppScreens } from "../navigation/screens";
import { verticalScale } from "react-native-size-matters";

const HandleMatchesButton = () => {
    const navigation = useNavigation()
    return (
        <Div w={"100%"} h={verticalScale(150)} flexDir="row">
            <TouchableOpacity style={{ width: '50%' }} onPress={() => navigation.navigate(AppScreens.MATCH_SCREEN)}>
                <ImageBackground style={{ justifyContent: 'center', height: "100%" }} source={require("../assets/match/InicioLeft.png")}>
                    <Div p={customTheme.spacing.medium}>
                        <Text fontFamily="NotoSans-BoldItalic" color="white" textAlign="center" fontSize={customTheme.fontSize.large} >BUSCAR{"\n"}PARTIDOS</Text>
                    </Div>
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '50%' }} >
                <ImageBackground style={{ justifyContent: "center", height: "100%" }} source={require("../assets/match/InicioRight.png")}>
                    <Div p={customTheme.spacing.medium}>
                        <Text color="white" fontFamily="NotoSans-BoldItalic" textAlign="center" fontSize={customTheme.fontSize.large}>ORGANIZAR{"\n"}PARTIDOS</Text>
                    </Div>
                </ImageBackground>
            </TouchableOpacity>
        </Div>
    );
};


export default HandleMatchesButton;
