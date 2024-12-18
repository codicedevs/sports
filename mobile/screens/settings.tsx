import React from 'react';
import { AppScreenProps, AppScreens } from '../navigation/screens';
import Football7Formation from '../components/fulbo7';
import SoccerField from '../components/canchaPrueba';
import DraggableCircles from '../components/newTrial';
import MoreCircles from '../components/fulbo7';

function SettingsScreen({ navigation }: AppScreenProps<AppScreens.SETTINGS_SCREEN>) {
    return(
        // <Football7Formation />
        <MoreCircles />
    )
}

export default SettingsScreen