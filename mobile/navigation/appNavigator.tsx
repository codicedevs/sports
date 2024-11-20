import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import VersionModal from '../components/modal/versionModal'
import { useSession } from '../context/authProvider'
import SplashScreen from '../screens/splash'
import { AuthStackScreen, Principal } from './stacks'

const AppNavigator = () => {
    const { currentUser } = useSession()

    return (
        <NavigationContainer>
            <VersionModal />
            <SplashScreen />
            {currentUser ? <Principal /> : <AuthStackScreen />}
        </NavigationContainer>
    )
}

export default AppNavigator