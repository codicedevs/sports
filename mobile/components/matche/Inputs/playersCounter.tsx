import React, { useEffect, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import { scale, verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native'

interface CounterInputProps {
    playerAmount: number,
    playerLimit:number,
    setPlayerLimit: React.Dispatch<React.SetStateAction<number>>
}

const PlayersCounterInput = ({ playerAmount, setPlayerLimit }: CounterInputProps) => {
    const [amount, setAmount] = useState(10)
    const LowLimit = playerAmount ? playerAmount * 2 : 10;
    const HighLimit = LowLimit + 5
//REFACTORIZAR ESTO
    useEffect(() => {
        if (playerAmount) {
            setAmount(playerAmount * 2)
            setPlayerLimit(playerAmount * 2)
        }
    }, [playerAmount])

    const IncreaseAmount = () => {
        if (amount === HighLimit) return
        setAmount(prev => prev + 1)
        setPlayerLimit(prev => prev + 1)
    }

    const DecreaseAmount = () => {
        if (amount === LowLimit) return
        setAmount(prev => prev - 1)
        setPlayerLimit(prev => prev - 1)
    }

    return (
        <Div rounded={'xl'} h={verticalScale(123)} p={customTheme.spacing.medium} style={{ gap: 8 }}>
            <Text fontSize={customTheme.fontSize.medium}>Cupo</Text>
            <Div flexDir='row' flex={1} justifyContent='center' alignItems='center' w={'100%'} >
                <TouchableOpacity onPress={DecreaseAmount}>
                    <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg={amount === LowLimit ? customTheme.colors.grayBackground : customTheme.colors.secondaryBackground}><Text color={amount === LowLimit ? customTheme.colors.gray : 'white'} textAlign='center' fontSize={customTheme.fontSize.xl}>-</Text></Div>
                </TouchableOpacity>
                <Div w={scale(56)} h={verticalScale(56)} justifyContent='center'><Text fontSize={customTheme.fontSize.xl} fontFamily='NotoSans_Condensed-BlackItalic' textAlign='center'>{amount}</Text></Div>
                <TouchableOpacity onPress={IncreaseAmount}>
                    <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg={amount === HighLimit ? customTheme.colors.grayBackground : customTheme.colors.secondaryBackground}><Text color={amount === HighLimit ? customTheme.colors.gray : 'white'} textAlign='center' fontSize={customTheme.fontSize.xl}>+</Text></Div>
                </TouchableOpacity>
            </Div>
        </Div>
    )
}

export default PlayersCounterInput
