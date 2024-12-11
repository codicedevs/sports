import React from 'react'
import { Button, Div, Input, Text } from 'react-native-magnus'

const step3 = () => {
  return (
    <Div>
    <Text>CLugar</Text>
    <Div>
      <Input placeholder="Lugar"></Input>
      <Input placeholder="lugar"></Input>
      <Input placeholder="Lugar"></Input>
    </Div>
    <Button>Terminar Creación</Button>
  </Div>
  )
}

export default step3