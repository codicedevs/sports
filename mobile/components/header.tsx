import React from "react";
import { Text, StyleSheet } from "react-native";
import { Div } from "react-native-magnus";

interface HeaderProps {}

export default function Header({ props }: HeaderProps) {
  return (
    <Div style={styles.container}>
      <Div>
        <Text style={styles.welcomeText}>BIENVENIDO</Text>
      </Div>

      <Text style={styles.titleText}>TOTITO</Text>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  welcomeText: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#000",
    textTransform: "uppercase",
  },
  titleText: {
    fontFamily: "RobotoCondensed-Black",
    fontSize: 30,
    color: "#000",
    lineHeight: 33,
    textTransform: "uppercase",
  },
});
