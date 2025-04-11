import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MatchPreferencesModal from "./matchPreferences";
import { useFocusEffect } from "@react-navigation/native";

const ConfirmPreferencesModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [open,setOpen] = useState(false)

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenPreferencesModal");
      if (!hasSeen) {
        setIsVisible(true);
      }
    };

    checkFirstVisit();
  }, []);

  const handleClose = async () => {
    // await AsyncStorage.setItem("hasSeenPreferencesModal", "true");
    setIsVisible(false);
  };

  const handleConfirm = async () => {
    // await AsyncStorage.setItem("hasSeenPreferencesModal", "true");
    setIsVisible(false);
    setOpen(true)
    // redirigir o algo extra
  };

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true)
    }, [])
  )

  return (
    <>
    <MatchPreferencesModal open={open} setOpen={setOpen}  />
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Organizar partido</Text>
          <Image
            source={require("../../assets/match/preferencia.png")}
            style={styles.image}
          />
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit diam mollis
            vel, litora hendrerit inceptos nisl volutpat risus id morbi rutrum
            egestas parturient.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.laterBtn} onPress={handleClose}>
              <Text style={styles.btnText}>Más tarde</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.btnText}>Sí, configurar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "50%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 16,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  laterBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  confirmBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmPreferencesModal;
