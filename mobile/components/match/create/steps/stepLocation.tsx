import React from 'react'

import { Button, Div, Input, Text } from 'react-native-magnus'

const StepLocation = () => {
  return (
    <Div>
    <Text>Cantidad</Text>
    <Div>
      <Input placeholder="Cantidad"></Input>
      <Input placeholder="Cantidad"></Input>
      <Input placeholder="Cantidad"></Input>
    </Div>
    <Button>Suiguiente</Button>
  </Div>
  )
}

export default StepLocation;

//location (opcional