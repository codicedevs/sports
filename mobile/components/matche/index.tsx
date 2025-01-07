import React, { useState, useEffect } from "react";
import { Button, Div } from "react-native-magnus";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import StepDiaHorario from "./steps/stepDiaHorario";
import StepLocation from "./steps/stepLocation";
import StepDeporteJugadores from "./steps/stepDeporteJugadores";
import matchService from "../../service/match.service";
type Step1Data = {
  dia: string;
  horario: string;
};

type Step2Data = {
  location: string;
};

type Step3Data = {
  deporte: string;
  jugadores: number ; 
};

type FormData = {
  step1Data: Step1Data;
  step2Data: Step2Data;
  step3Data: Step3Data;
};

const Index = () => {
  const [counterSteps, setCounterSteps] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    step1Data: { dia: "", horario: "" },
    step2Data: { location: "" },
    step3Data: { deporte: "", jugadores: 0 },
  });
  
  const opacity = useSharedValue(1); // Controla la opacidad del contenido

  useEffect(() => {
    opacity.value = 0; // Reinicia la opacidad
    opacity.value = withTiming(1, { duration: 600 }); // Aplica la animación
  }, [counterSteps]);

  const handleNext = ( data: Step1Data | Step2Data | Step3Data) => {
    setFormData((prev) => ({
      ...prev,
      [`step${counterSteps}Data`]: data,
    }));
    if (counterSteps < 3) {
      setCounterSteps((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (counterSteps > 1) {
      setCounterSteps((prev) => prev - 1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  async function CreateMatch() {
    if (!!formData.step1Data && !!formData.step2Data && !!formData.step3Data) {
      console.log("AAAAAAAAAAAAAAAA", formData.step1Data);
      console.log("BBBBBBBBBBBBBBBBBBBB", formData.step2Data);
      console.log("CCCCCCCCCCCCCCCCCC", formData.step3Data);
      setLoading(true);
      try {
        const newLoad = {
          name: "cccccccccccccc",
          date: formData.step1Data.dia,
          //horario: formData.step1Data.horario,
          location: formData.step2Data.location,
          sportMode: "676efe9ce1e21de23e0e7ab4",
          playersLimit: formData.step3Data.jugadores,
          userId: "6772aa80377f4e04b405b99f",
        };

        console.log("Enviando datos:", newLoad); // Debug

        const response = await matchService.create(newLoad);
        console.log("Partido creado:", response);
      } catch (error) {
        console.error("Error al crear el partido:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    CreateMatch();
  }, [formData.step3Data]);

  const steps = [
    <StepDiaHorario initialData={formData.step1Data} onNext={handleNext} />,
    <StepLocation initialData={formData.step2Data} onNext={handleNext} onBack={handlePreviousStep} />,
    <StepDeporteJugadores
      initialData={formData.step3Data}
      onNext={handleNext}
    />,
  ];

  return (
    <Animated.View style={animatedStyle}>{steps[counterSteps - 1]}</Animated.View>
  );
};

export default Index;
