import { Image } from "react-native"
import { Div, Text } from "react-native-magnus"
import { scale } from "react-native-size-matters"
import { customTheme } from "../../utils/theme"

export const CustomHeader = () => {
    return (
        <Div flexDir="row" alignItems="center" p={customTheme.spacing.medium} justifyContent="space-between">
            <Image style={{ height: scale(28), width: scale(23), padding:customTheme.spacing.small }} source={require("../../assets/match/backIcon.png")} />
            <Image style={{ height: scale(35), width: scale(35) }} source={require("../../assets/match/logoF.png")} />
            <Div position="relative">
                <Image style={{ height: scale(27), width: scale(22) }} source={require("../../assets/match/bellInclinada.png")} />
                <Div position="absolute" right={0} top={4} rounded={'circle'} alignItems="center" justifyContent="center" bg="orange" px={scale(3)}>
                    <Text fontSize={7}>2</Text>
                </Div>
            </Div>
        </Div>
    )
}