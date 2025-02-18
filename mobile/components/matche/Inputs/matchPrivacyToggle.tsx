import React, { useEffect, useState } from 'react';
import { Div, Text } from 'react-native-magnus';
import { customTheme } from '../../../utils/theme';
import { verticalScale } from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native';
import { PrivacyOption } from '../../../types/form.type';

interface PrivacyToggleProps {
  matchDetailsRef: React.MutableRefObject<{
    privacyOption: boolean;
  }>;
}

const MatchPrivacyToggleInput = ({ matchDetailsRef }: PrivacyToggleProps) => {
  const [privacyOption, setPrivacyOption] = useState<PrivacyOption>(
    matchDetailsRef.current.privacyOption ? "public" : "private"
  );

  const handleToggle = (option: PrivacyOption) => {
    setPrivacyOption(option);
    if (option === "private") {
      matchDetailsRef.current.privacyOption = false;
    } else {
      matchDetailsRef.current.privacyOption = true;
    }
  };

  useEffect(() => {
    setPrivacyOption(matchDetailsRef.current.privacyOption ? "public" : "private")
  },[matchDetailsRef.current.privacyOption])

  const isPrivate = privacyOption === 'private';
  const isPublic = privacyOption === 'public';

  return (
    <Div p={customTheme.spacing.medium} style={{ gap: 8 }}>
      <Div h={verticalScale(40)} flexDir="row">
        <Div
          flex={1}
          h={verticalScale(40)}
          justifyContent="center"
          borderWidth={1}
          bg={isPrivate ? customTheme.colors.secondaryBackground : 'white'}
        >
          <TouchableOpacity onPress={() => handleToggle('private')}>
            <Text color={isPrivate ? 'white' : 'black'} textAlign="center">
              Privado
            </Text>
          </TouchableOpacity>
        </Div>
        <Div
          flex={1}
          h={verticalScale(40)}
          justifyContent="center"
          borderWidth={1}
          bg={isPublic ? customTheme.colors.secondaryBackground : 'white'}
        >
          <TouchableOpacity onPress={() => handleToggle('public')}>
            <Text color={isPublic ? 'white' : 'black'} textAlign="center">
              Público
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
      <Text fontFamily="NotoSans-Variable" textAlign="auto">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Consequat vestibulum felis dis dis
        consectetur. Ornare etiam class ligula.
      </Text>
    </Div>
  );
};

export default MatchPrivacyToggleInput;
