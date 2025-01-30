import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Modal, StyleSheet } from "react-native";
import { Button } from "react-native-magnus";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import Header from "../components/header";
import StatisticCard from "../components/statisticCard";
import SquareCard, { SquareCardProps } from "../components/squareCard";
import Location from "../types/location.type";
import { UserPreferences } from "../types/preferences.type";
import { StepAvailability, StepSport, StepZones } from "../components/userPreferencesSteps";
import SectionPhoto from "../components/SectionPhoto";
import MatchCard from "../components/cards/matchCard";
import ModalAnimation from "../components/cards/animatedCard";
import Index from "../components/matche";
import { useSession } from "../context/authProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";
import authService from "../service/auth.service";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserPreferences>({
    sport: '',
    sportMode: '',
    availability: [],
    preferredZones: [],
  });
  const [counterSteps, setCounterSteps] = useState(0)
  const [openMatchModal, setOpenMatchModal ] = useState(false)

  // Estados para manejar los modales y pasos
  const [openStep, setOpenStep] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);

  const { setCurrentUser,currentUser, showModal } = useSession();

  const checkUser = async () => {
    try {
      const res = await authService.whoAmI();
      setCurrentUser(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const updateUserInfo = (info: Partial<UserPreferences>) => {
    setUserInfo((prev) => ({ ...prev, ...info }));
  };

  const handleNext = (data: any) => {
    setUserInfo((prev) => ({ ...prev, ...data }));
    if (counterSteps < steps.length - 1) {
      setCounterSteps((prev) => prev + 1);
    } else {
      handleModalClose();
    }
  };
  
  const steps = [
    <StepSport userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
    <StepAvailability userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
    <StepZones userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
  ];
  
  const checkCurrentUser = (fn) => {
    if(!currentUser){
      showModal
    } else {
      fn()
    }
  }

  const handleModalClose = () => {
    console.log("Información final del usuario:", userInfo);
    setModalVisible(false);
    setCounterSteps(0);
    setUserInfo({
      sport: '',
      sportMode: '',
      availability: [],
      preferredZones: [],
    });
  };
  function handleStep() {
    setOpenStep(true);
  };

  const cardData: SquareCardProps[] = [
    // Datos de las tarjetas
  ];

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Header />
      <ScrollView
        contentContainerStyle={{
          padding: 10,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <StatisticCard style={{ flex: 1 }} />
        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 10,
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}
        >
          {cardData.map((data, index) => (
            <SquareCard
              key={index}
              title={data.title}
              score={data.score}
              hour={data.hour}
              location={data.location}
              backgroundimage={data.backgroundimage}
            />
          ))}
        </ScrollView>
        <SectionPhoto backGroundImage={require("../assets/photoNew.png")} />
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <Button
          onPress={() => navigation.navigate(AppScreens.TRIAL1_SCREEN)}
          mt={10}
          bg="blue600"
        >
          <Text style={{ color: "white" }}>Ir a Trial1 Screen</Text>
        </Button>
        <Button onPress={handleStep} mt={10} bg="blue600">
          <Text style={{ color: "white" }}>Crear Partidooo</Text>
        </Button>
        <Button
          onPress={() => setNewModalVisible(true)}
          mt={10}
          bg="green600"
        >
          <Text style={{ color: "white" }}>Abrir Nuevo Modal</Text>
        </Button>
        <Modal
          transparent
          visible={newModalVisible}
          animationType="slide"
          onRequestClose={() => setNewModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Animación Lottie */}
              <LottieView
                source={require("../assets/lottie animation/prueba.json")} // Ruta de tu archivo .json
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
             
              <Button
                onPress={() => setNewModalVisible(false)}
                mt={10}
                bg="red600"
              >
                <Text style={{ color: "white" }}>Cerrar Modal</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <ModalAnimation open={openStep} onFinish={() => setOpenStep(false)}>
          <Index />
        </ModalAnimation>
        <Button onPress={() => {
          !currentUser?
          showModal():
          setOpenMatchModal(!openMatchModal)
          }}>
          <Text>Abrir modal del partido</Text>
        </Button>
        <MatchModalHandler open={openMatchModal} setOpen={setOpenMatchModal} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default HomeScreen;
