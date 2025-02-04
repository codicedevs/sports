import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import VersionModal from '../components/modal/versionModal'
import { useSession } from '../context/authProvider'
import SplashScreen from '../screens/splash'
import { AuthStackScreen, Principal } from './stacks'
import { useFonts } from 'expo-font'
import RestrictiveModal from '../components/modal/restrictiveModal'
import { navigationRef } from '../utils/navigation'

const AppNavigator = () => {
    const { currentUser } = useSession()

    const [loaded, error] = useFonts({
        'coolvetica': require('../assets/fonts/coolvetica.otf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <VersionModal />
            <RestrictiveModal />
            <SplashScreen />
            {true ? <Principal /> : <AuthStackScreen />}
        </NavigationContainer>
    )
}

export default AppNavigator