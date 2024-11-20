import React from 'react';
import { Button, Text, View } from 'react-native';
import { FadeWrapper } from '../components/fadeView';
import useFetch from '../hooks/useGet';
import { AppScreenProps, AppScreens } from '../navigation/screens';
import userService from '../service/user.service';
import { QUERY_KEYS } from '../types/query.types';
import { User } from '../types/user.type';

function SettingsScreen({ navigation }: AppScreenProps<AppScreens.SETTINGS_SCREEN>) {
    const { data } = useFetch<User>(userService.getAll, QUERY_KEYS.USERS, { meta: { triggerGlobalLoader: false } });

    return (
        <FadeWrapper>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
                {
                    data && data.map((user: User) => (
                        <Text>{user.nombre}</Text>
                    ))
                }
                <Button onPress={() => { navigation.navigate(AppScreens.TRIAL2_SCREEN) }} title='slide' />
            </View>
        </FadeWrapper>
    )
}

export default SettingsScreen