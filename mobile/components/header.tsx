import { Text } from "react-native-animatable";
import { Div } from "react-native-magnus";

interface HeaderProps {}

export default function Header({ props }: HeaderProps) {
  return (
    <Div w="100%" px={3} py={5}>
      <Div>
        <Text
          style={{
            fontFamily: "RobotoCondensed",
            fontSize: 13,
            color: "#000",
          }}
        >
          BIENVENIDO
        </Text>
      </Div>

      <Text
        style={{
          fontFamily: "RobotoCondensed-Black",
          fontSize: 30,
          color: "#000",
          lineHeight: 33,
        }}
      >
        TOTITO
      </Text>
    </Div>
  );
}
