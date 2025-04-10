import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MatchDetails } from "../types/form.type";
import { useGlobalUI } from "../context/globalUiContext";
import MatchForm from "../components/matche/Form/match";

interface MatchHandlerScreenProps {
  match?: string;
  onMatchCreated?: (matchId: string) => void;
}

export default function MatchHandlerScreen({
  match,
  onMatchCreated,
}: MatchHandlerScreenProps) {
  const navigation = useNavigation();
 

  function closeScreen() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <MatchForm match={match} onGoBack={closeScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
