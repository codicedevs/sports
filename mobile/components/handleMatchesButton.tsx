import React from "react";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppScreens } from "../navigation/screens";
import { scale, verticalScale } from "react-native-size-matters";
import { useSession } from "../context/authProvider";

const HandleMatchesButton = () => {
    const navigation = useNavigation()
    const { currentUser, showModal } = useSession()
    return (
        <Div w={"100%"} h={verticalScale(153)} justifyContent="center" style={{ gap: scale(10) }} flexDir="row">
           <TouchableOpacity  style={{ width: '50%' }} onPress={() => currentUser? navigation.navigate(AppScreens.MATCH_SCREEN) : showModal()}>
            <Div borderWidth={1} h={"100%"} rounded={"lg"} w={scale(160)} alignItems="center" justifyContent="space-between" pt={customTheme.spacing.small}>
                <Image style={{ width: scale(79), height: verticalScale(75) }} resizeMode="cover" source={require("../assets/match/searchMatch.png")} />
                <Text textAlignVertical="bottom" fontFamily="NotoSans-BoldItalic" color="black" textAlign="center" fontSize={customTheme.fontSize.large} >BUSCAR{"\n"}PARTIDOS</Text>
            </Div>
           </TouchableOpacity>
            <TouchableOpacity  onPress={() => currentUser? navigation.navigate(AppScreens.MATCH_HANDLER) : showModal()} style={{ width: '50%' }} >
            <Div borderWidth={1} h={"100%"} rounded={"lg"} w={scale(160)} alignItems="center" justifyContent="space-between" pt={customTheme.spacing.small}>
                <Image style={{ width: scale(83), height: verticalScale(76) }} resizeMode="cover" source={require("../assets/match/organizeMatch.png")} />
                <Text color="black" fontFamily="NotoSans-BoldItalic" textAlign="center" textAlignVertical="bottom" fontSize={customTheme.fontSize.large}>ORGANIZAR{"\n"}PARTIDOS</Text>
            </Div>
            </TouchableOpacity>
        </Div>
    );
};


export default HandleMatchesButton;
