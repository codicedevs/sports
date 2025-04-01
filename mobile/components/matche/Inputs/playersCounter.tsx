import React, { useEffect, useRef, useState } from 'react';
import { Div, Text } from 'react-native-magnus';
import { customTheme } from '../../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native';

interface PlayersCounterInputProps {
  matchDetailsRef: React.MutableRefObject<{
    playerLimit: number;
    selectedSportMode?: { label: number };
  }>;
}

const PlayersCounterInput = ({ matchDetailsRef }: PlayersCounterInputProps) => {
  const defaultBase = matchDetailsRef.current.selectedSportMode?.label || 5;
  const lowLimit = defaultBase * 2;
  const highLimit = lowLimit + 5;
  const initialAmount =
    matchDetailsRef.current.playerLimit > 0 ? matchDetailsRef.current.playerLimit : lowLimit;
  const [amount, setAmount] = useState<number>(initialAmount); //Probar que no pase mas lo de q aparezca 0
  
  useEffect(() => {
    if (matchDetailsRef.current.playerLimit === lowLimit) {
      setAmount(lowLimit);
      matchDetailsRef.current.playerLimit = lowLimit;
    } else {
      setAmount(matchDetailsRef.current.playerLimit)
    }
  }, [matchDetailsRef.current.selectedSportMode]);

  const increaseAmount = () => {
    if (amount < highLimit) {
      const newAmount = amount + 1;
      setAmount(newAmount);
      matchDetailsRef.current.playerLimit = newAmount;
    }
  };

  const decreaseAmount = () => {
    if (amount > lowLimit) {
      const newAmount = amount - 1;
      setAmount(newAmount);
      matchDetailsRef.current.playerLimit = newAmount;
    }
  };

  return (
    <Div rounded="xl" h={verticalScale(123)} p={customTheme.spacing.medium} style={{ gap: 8 }}>
      <Text fontSize={customTheme.fontSize.medium}>Cupo</Text>
      <Div flexDir="row" flex={1} justifyContent="center" alignItems="center" w="100%">
        <TouchableOpacity onPress={decreaseAmount}>
          <Div
            w={scale(119)}
            h={verticalScale(56)}
            justifyContent="center"
            bg={
              amount === lowLimit
                ? "white"
                : customTheme.colors.secondaryBackground
            }
          >
            <Text
              color={amount === lowLimit ? customTheme.colors.gray : 'white'}
              textAlign="center"
              fontSize={customTheme.fontSize.xl}
            >
              -
            </Text>
          </Div>
        </TouchableOpacity>
        <Div w={scale(56)} h={verticalScale(56)} justifyContent="center">
          <Text
            fontSize={customTheme.fontSize.xl}
            fontFamily="NotoSans_Condensed-BlackItalic"
            textAlign="center"
          >
            {amount}
          </Text>
        </Div>
        <TouchableOpacity onPress={increaseAmount}>
          <Div
            w={scale(119)}
            h={verticalScale(56)}
            justifyContent="center"
            bg={
              amount === highLimit
                ? "white"
                : customTheme.colors.secondaryBackground
            }
          >
            <Text
              color={amount === highLimit ? customTheme.colors.gray : 'white'}
              textAlign="center"
              fontSize={customTheme.fontSize.xl}
            >
              +
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  );
};

export default PlayersCounterInput;
