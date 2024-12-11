import React, { useState } from "react";
import { Div } from "react-native-magnus";
import StepDiaHorario from "./steps/stepDiaHorario";
import StepLocation from "./steps/stepLocation";

const Index = () => {
  const [counterSteps, setCounterSteps] = useState(1); //en que step estamos
  const [formData, setFormData] = useState({ // garudar datos cada paso
    step1Data: null,
    step2Data: null,
    step3Data: null,
  });

  const handleNext = (data) => { //data:dato actual 
    setFormData((prev) => ({
      ...prev,
      [`step${counterSteps}Data`]: data,
    }));
    if (counterSteps < 3) {
      setCounterSteps((prev) => prev + 1);
    } else {
        
    }
  };

  const handlePreviousStep = () => {
    if (counterSteps > 1) {
      setCounterSteps((prev) => prev - 1);
    }
  };

  return (<Div>
    {counterSteps === 1 && (
        <StepDiaHorario/>
    )}
  </Div>)
};

export default Index;


//dia y horiario // location (opcional// tipo deporte cant jug 