import { useIsFetching } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { LoadingText, SpinnerContainer } from './styled/styled';

const SpinnerScreen = () => {
    const isFetching = useIsFetching({
        predicate: (query) => query.meta?.triggerGlobalLoader === true,
    });

    if (isFetching === 0) return null;

    return (
        <SpinnerContainer>
            <ActivityIndicator size="large" color="#ffffff" />
            <LoadingText >Cargando...</LoadingText>
        </SpinnerContainer>
    );
}

export default SpinnerScreen;
