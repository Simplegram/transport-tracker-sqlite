import { useTheme } from '@/context/ThemeContext'
import React from 'react'
import { ActivityIndicator, Dimensions } from 'react-native'
import ModalTemplate from './ModalTemplate'
import Input from './input/Input'

type Props = {
    text?: String
}

export default function LoadingScreen({ text = "Loading..." }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

    return (
        <ModalTemplate style={{ width: screenWidth, height: screenHeight }} animationType="fade" visible={true}>
            <ModalTemplate.Backdrop style={{ alignItems: 'center', width: screenWidth, height: screenHeight }}>
                <ModalTemplate.Container style={
                    {
                        borderColor: theme.palette.borderColor,
                        borderRadius: 10,
                    }
                }>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Input.Title>{text}</Input.Title>
                </ModalTemplate.Container>
            </ModalTemplate.Backdrop>
        </ModalTemplate>
    )
}