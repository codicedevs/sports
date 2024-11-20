import { yupResolver } from "@hookform/resolvers/yup"
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Div, Icon, Input, Text } from "react-native-magnus"
import { verticalScale } from "react-native-size-matters"
import * as yup from "yup"
import { ErrorInputMessageContainer, ErrorMessageText, LoginInputContainer, LoginTitleContainer, LoginTittle, MainContainer } from '../../components/styled/styled'
import { AuthContext } from '../../context/authProvider'
import { useMutate } from '../../hooks/useMutate'
import authService from '../../service/auth.service'
import { UserInfo } from '../../types/user.type'

const validationSchema = yup.object({
    username: yup.string().required("Requerido").min(6, 'El usuario debe tener al menos 6 caracteres'),
    pass: yup.string().required("Requerido").min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

const LoginScreen = () => {
    const { setCurrentUser } = useContext(AuthContext)
    const [visibility, setVisibility] = useState(true)

    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<UserInfo>({ resolver: yupResolver(validationSchema) })

    const login = async (data: { username: string, pass: string }) => {
        const res = await authService.login(data.username, data.pass);
        if (res) {
            await AsyncStorage.setItem('refresh', res.refreshToken ?? '');
            await AsyncStorage.setItem('access', res.token ?? '');
        }
        return res;
    }

    const loginQuery = useMutate(login, (res) => { setCurrentUser(res?.user) }, (err) => { console.error(err) })

    const onSubmit = async (data: UserInfo) => {
        console.log(data)
        try {
            await loginQuery(data);
        } catch (error) {
            console.error('Failed to login:', error);
        }
    }

    return (
        <KeyboardAwareScrollView
            enableAutomaticScroll
        >
            <MainContainer>
                <LoginTitleContainer>
                    <LoginTittle>Codicia</LoginTittle>
                </LoginTitleContainer>
                <LoginInputContainer>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <Input
                                    mb={verticalScale(10)}
                                    placeholder="Nombre de usuario"
                                    placeholderTextColor={"black"}
                                    h={'13%'}
                                    onChangeText={(text) => {
                                        const cleanedValue = text.replace(/\s/g, '');
                                        onChange(cleanedValue);
                                    }}
                                    focusBorderColor="blue700"
                                    value={value}
                                />
                                <ErrorInputMessageContainer>
                                    {errors.username && <ErrorMessageText>{errors.username.message as string}</ErrorMessageText>}
                                </ErrorInputMessageContainer>
                            </>
                        )}
                        name="username"
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <Input
                                    placeholder="Contraseña"
                                    placeholderTextColor={"black"}
                                    onChangeText={onChange}
                                    value={value}
                                    h={'13%'}
                                    mb={verticalScale(10)}
                                    secureTextEntry={visibility}
                                    suffix={
                                        <TouchableOpacity onPress={toggleVisibility}>
                                            <Icon name={visibility ? "eye" : 'eye-off'} color="gray900" fontFamily="Feather" />
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorInputMessageContainer>
                                    {errors.username && <ErrorMessageText>{errors.pass?.message as string}</ErrorMessageText>}
                                </ErrorInputMessageContainer>
                            </>
                        )}
                        name="pass"
                    />
                    <Div mb={verticalScale(20)} alignSelf="flex-end">
                        <Text>Forgot password</Text>
                    </Div>
                    <Button w={'100%'} h={'10%'} p={-10}>Login</Button>
                    <Text mt={verticalScale(20)}>Do you have an account? Register</Text>
                </LoginInputContainer>
            </MainContainer>
        </KeyboardAwareScrollView>
    )
}

export default LoginScreen