import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import VersionModal from '../components/modal/versionModal'
import SplashScreen from '../screens/splash'
import { AuthStackScreen, Principal } from './stacks'
import RestrictiveModal from '../components/modal/restrictiveModal'
import { navigationRef } from '../utils/navigation'

const AppNavigator = () => {

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