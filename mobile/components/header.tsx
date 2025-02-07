// import React from "react";
// import { Text, StyleSheet, ImageBackground } from "react-native";
// import { Div } from "react-native-magnus";
// import { scale } from "react-native-size-matters";

// interface HeaderProps {}

// export default function Header({ props }: HeaderProps) {
//   return (
//     <Div style={styles.container} justifyContent="center">
//       <Div>
//         <Text style={styles.welcomeText}>BIENVENIDO</Text>
//       </Div>
//       <Text style={styles.titleText}>TOTITO</Text>
//       <ImageBackground
//         source={require("../assets/logo.png")}
//         style={styles.imageBackground}
//       ></ImageBackground>
//     </Div>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     paddingHorizontal: scale(7),
//     paddingVertical: scale(3),
//   },
//   welcomeText: {
//     fontFamily: "Inter",
//     fontSize: scale(11),
//     color: "#000",
//     textTransform: "uppercase",
//   },
//   titleText: {
//     fontFamily: "RobotoCondensed-Black",
//     fontSize: scale(25),
//     color: "#000",
//     lineHeight: scale(28),
//     textTransform: "uppercase",
//   },
//   imageBackground: {
//     position: "absolute",
//     right: scale(0),
//     width: scale(80),
//     height: scale(80),
//   },
// });
