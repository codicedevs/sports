import React, { useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import { verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native';

type state = "public" | "private";

const MatchPrivacyToggleInput = () => {
    const [isOpen, setIsOpen] = useState<state>("private")
    return (
        <Div p={customTheme.spacing.medium} style={{ gap: 8 }}>
            <Div h={verticalScale(40)} flexDir='row'>
                <Div flex={1} h={verticalScale(40)} justifyContent='center' borderWidth={1} bg={isOpen === "public" ? "white" : customTheme.colors.secondaryBackground}>
                    <TouchableOpacity onPress={() => setIsOpen("private")}>
                        <Text color={isOpen === "public" ? "black" : "white"} textAlign='center'>Privado</Text>
                    </TouchableOpacity>
                </Div>
                <Div flex={1} h={verticalScale(40)} justifyContent='center' borderWidth={1} bg={isOpen === "private" ? "white" : customTheme.colors.secondaryBackground}>
                    <TouchableOpacity onPress={() => setIsOpen("public")}>
                        <Text textAlign='center' color={isOpen === "private" ? "black" : "white"}>Publico</Text>
                    </TouchableOpacity>
                </Div>
            </Div>
            <Text fontFamily='NotoSans-Variable' textAlign='auto'>Lorem ipsum odor amet, consectetuer adipiscing elit. Consequat vestibulum felis dis dis consectetur. Ornare etiam class ligula.</Text>
        </Div>
    )
}

export default MatchPrivacyToggleInput
