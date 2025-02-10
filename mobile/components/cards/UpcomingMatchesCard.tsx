import { Div, Image, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import reloj from "@assets/reloj.png";
import players from "@assets/players.png";
import flecha from "@assets/flecha.png";

type UpcomingMatchProps = {
    fecha: string;
    cupo: string;
    titulo: string;
};

const UpcomingMatchCard: React.FC<UpcomingMatchProps> = ({ fecha, cupo, titulo }) => {
    return (
        <Div
            h={verticalScale(160)}
            w={scale(150)}
            rounded="md"
            borderWidth={1}
            borderColor="black"
            p={customTheme.spacing.medium}
            justifyContent="space-between"
        >
            <Div flexDir="row">
                <Image source={reloj} h={customTheme.spacing.medium} w={scale(15)} mt={scale(2)} mr={customTheme.spacing.xs} resizeMode="contain" />
                <Text fontSize={customTheme.fontSize.medium} fontFamily="NotoSans-Variable">
                    {fecha}
                </Text>
            </Div>

            <Text
                fontSize={20}
                fontFamily="NotoSans-BoldItalic"
            >
                {titulo}    
            </Text>
            <Div
                flexDir="row"
                justifyContent="space-between"
            >
                <Div bg="#D9FA53" flexDir="row" >
                    <Image source={players} bg="#D9FA53" resizeMode="contain"  w={customTheme.fontSize.medium}/>
                    <Text ml={5} fontSize={customTheme.fontSize.medium} >{cupo}</Text>
                </Div>
                <Image source={flecha}  resizeMode="contain" w={customTheme.fontSize.title} />
            </Div>
        </Div>
    )
};

export default UpcomingMatchCard;