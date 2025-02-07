import { Div, Image, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import reloj from "@assets/reloj.png";
import players from "@assets/players.png";
import flecha from "@assets/flecha.png";


const UpcomingMatchCard = () => {
    return (
        <Div
            h={"auto"}
            w={scale(150)}
            rounded="md"
            borderWidth={1}
            borderColor="black"
            pt={customTheme.spacing.small}
            pb={customTheme.spacing.small}
            alignItems="center"
        >
            <Div flexDir="row" alignItems="center" h={"auto"} mt={scale(5)}>
                <Image source={reloj} h={scale(17)} w={scale(17)} mr={5} resizeMode="contain" mb={scale(3)} />
                <Text w={128} h={"auto"} fontSize={17}>
                    Vi 30/12 00:00
                </Text>
            </Div>

            <Text
                fontSize={20}
                p={10}
                mt={scale(5)}
                fontFamily="NotoSans-BoldItalic"
            >
                SUPER CLUB FUTBOL 5</Text>
            <Div
                w={128}
                h={"auto"}
                flexDir="row"
                alignItems="center"
                justifyContent="space-between"
                mt={scale(10)}
                mb={scale(6)}
            >
                <Div bg="#D9FA53" flexDir="row" h={"auto"} >
                    <Image source={players} h={20} w={20} bg="#D9FA53" resizeMode="contain" />
                    <Text ml={5} fontSize={customTheme.fontSize.medium} >6/10</Text>
                </Div>
                <Image source={flecha} h={22} w={22} resizeMode="contain" position="absolute" right={scale(-8)} />
            </Div>
        </Div>
    )
};

export default UpcomingMatchCard;