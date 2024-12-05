import { Image, StyleProp } from "react-native";
import { Text } from "react-native-animatable";
import { Div } from "react-native-magnus";

interface HeaderProps {
}

export default function Header({ props }: HeaderProps) {
    return (
        <Div justifyContent="space-between" flexDir="row" w={"100%"} >
            <Div>
                <Text style={{ fontFamily: "RobotoCondensed-Regular", fontSize: 19 }}>Bienvenido</Text>
                <Text style={{ fontFamily: "RobotoCondensed-Bold", fontSize: 25 }}>Martin</Text>
            </Div>
            <Div>
                <Image
                    style={{ width: 100, height: 100, marginTop: -25 }}
                    source={require('@assets/logo.png')}
                />
            </Div>
        </Div>
    )
}