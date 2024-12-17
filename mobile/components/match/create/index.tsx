import React, { useState, useEffect } from "react";
import { Div } from "react-native-magnus";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import StepDiaHorario from "./steps/stepDiaHorario";
import StepLocation from "./steps/stepLocation";
import StepDeporteJugadores from "./steps/stepDeporteJugadores";
import { AnyObject } from "yup";

const Index = () => {
  const [counterSteps, setCounterSteps] = useState(1); // Estado del step actual
  const [formData, setFormData] = useState({
    step1Data: undefined,
    step2Data: undefined,
    step3Data: undefined,
  });

  const opacity = useSharedValue(1); // Controla la opacidad del contenido

  // Animación de opacidad al cambiar de step
  useEffect(() => {
    opacity.value = 0; // Reinicia la opacidad
    opacity.value = withTiming(1, { duration: 600 }); // Aplica la animación con duración de 300ms
  }, [counterSteps]); // Se ejecuta cuando cambia el step actual

  // Función para cambiar al siguiente step
  const handleNext = (data: AnyObject) => {
    setFormData((prev) => ({
      ...prev,
      [`step${counterSteps}Data`]: data,
    }));
    if (counterSteps < 3) {
      setCounterSteps((prev) => prev + 1);
    }
  };

  // Función para regresar al step anterior
  const handlePreviousStep = () => {
    if (counterSteps > 1) {
      setCounterSteps((prev) => prev - 1);
    }
  };

  // Estilo animado para aplicar opacidad
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Div>
        {counterSteps === 1 && (
          <StepDiaHorario
            initialData={formData.step1Data || undefined}
            onNext={(data) => handleNext(data)}
          />
        )}
        {counterSteps === 2 && (
          <StepLocation
            initialData={formData.step2Data}
            onNext={(data) => handleNext(data)}
            onBack={handlePreviousStep}
          />
        )}
        {counterSteps === 3 && (
          <StepDeporteJugadores
            initialData={formData.step3Data}
            onNext={(data) => handleNext(data)}
          />
        )}
      </Div>
    </Animated.View>
  );
};

export default Index;

//dia y horiario // location (opcional// tipo deporte cant jug
