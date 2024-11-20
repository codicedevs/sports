import React from 'react';
import { Button, Div, Text } from 'react-native-magnus';
import { VERSION } from '../../utils/config';
import { ModalContainer, ModalTextContainer, SplashContainer } from '../styled/styled';

const VersionModal = () => {

    if (VERSION === '1.0') return null;

    return (
        <SplashContainer>
            <ModalContainer>
                <ModalTextContainer>
                    <Div>
                        <Text fontSize='4xl'>Nueva actualización</Text>
                    </Div>
                    <Div>
                        <Text fontSize='md' textAlign='justify'>Parece que estás utilizando una versión anterior de nuestra aplicación.</Text>
                        <Text fontSize='md' textAlign='justify'>Necesitás actualizar a la última versión para seguir utilizandola.</Text>
                    </Div>
                    <Div>
                        <Button>Actualizar</Button>
                    </Div>
                </ModalTextContainer>
            </ModalContainer>
        </SplashContainer>
    );
};

export default VersionModal;
