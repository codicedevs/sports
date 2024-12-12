import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const Football7Formation: React.FC = () => {
  const screenHeight = Dimensions.get("window").height;

  // Team formations
  const teamFormation = [1, 2, 2]; // Original team
  const rivalFormation = [2, 2, 1]; // Rival team, reversed order

  // Combine formations for layout calculations
  const totalRows = teamFormation.length + rivalFormation.length;

  return (
    <View style={[styles.field, { height: screenHeight }]}>
      {/* Team Rows */}
      {teamFormation.map((num, rowIndex) => (
        <View style={[styles.row, { height: screenHeight / totalRows }]} key={`team-${rowIndex}`}>
          {Array.from({ length: num }).map((_, colIndex) => (
            <View style={styles.box} key={`team-box-${rowIndex}-${colIndex}`}>
              <Text style={styles.content}>Team</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Rival Rows */}
      {rivalFormation.map((num, rowIndex) => (
        <View style={[styles.row, { height: screenHeight / totalRows }]} key={`rival-${rowIndex}`}>
          {Array.from({ length: num }).map((_, colIndex) => (
            <View style={styles.box} key={`rival-box-${rowIndex}-${colIndex}`}>
              <Text style={styles.content}>Rival</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "lightblue",
  },
  content: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Football7Formation;
