import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import VersionModal from '../components/modal/versionModal'
import { useSession } from '../context/authProvider'
import SplashScreen from '../screens/splash'
import { AuthStackScreen, Principal } from './stacks'
import { useFonts } from 'expo-font'

const AppNavigator = () => {
    const { currentUser } = useSession()

    const [loaded, error] = useFonts({
        'coolvetica': require('../assets/fonts/coolvetica.otf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <VersionModal />
            <SplashScreen />
            {currentUser ? <Principal /> : <AuthStackScreen />}
        </NavigationContainer>
    )
}

export default AppNavigator