import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { hexToRgbA } from "@/src/utils/colorUtils"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, EasingFunction, StyleSheet, TouchableOpacity, Vibration, View } from "react-native"
import Input from "./Input"

interface SwitcherProps {
    title?: string
    onPress: () => void
    overrideIsEnabled?: boolean
    children?: string
}

export default function Switcher({ title, onPress, overrideIsEnabled, children }: SwitcherProps) {
    return (
        <View style={{
            height: 30,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Input.Label>{title ? title : children}</Input.Label>
            <CustomSwitch onPress={onPress} overrideIsEnabled={overrideIsEnabled} />
        </View>
    )
}

interface SwitchProps {
    onPress: () => void
    overrideIsEnabled?: boolean
}

export function CustomSwitch({ onPress, overrideIsEnabled }: SwitchProps) {
    const { theme } = useTheme()
    const { enableVibration } = useSettings()

    const [isEnabled, setIsEnabled] = useState(false)

    useEffect(() => {
        if (overrideIsEnabled) setIsEnabled(overrideIsEnabled)
    }, [overrideIsEnabled])

    const ballTranslateX = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const ballMovingAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(ballTranslateX, {
            toValue,
            duration: 150,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const ballTranslate = ballTranslateX.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    })

    const ballScale = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const ballScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(ballScale, {
            toValue,
            duration: 125,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const ballScaleTranslate = ballScale.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [1, 0.7, 0.7, 1]
    })

    const trackBaseColor = theme === 'light' ? colors.white_400 : colors.white_650
    const trackEnabledColor = theme === 'light' ? colors.primary : colors.primary_100
    const ballColor = theme === 'light' ? colors.white_100 : colors.white_200

    const colorTransition = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const colorAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(colorTransition, {
            toValue,
            duration: 225,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const colorValue = colorTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [hexToRgbA(trackBaseColor), hexToRgbA(trackEnabledColor)]
    })

    const onChangeHandler = () => {
        const newValue = !isEnabled
        setIsEnabled(newValue)

        colorAnimation(newValue ? 1 : 0, Easing.bounce)
        ballMovingAnimation(newValue ? 1 : 0, Easing.bezier(0, .54, .47, .71))
        enableVibration && Vibration.vibrate(5)

        onPress()
    }

    const onPresssIn = () => {
        const newValue = !isEnabled
        ballScaleAnimation(newValue ? 1 : 0, Easing.bounce)
    }

    return (
        <TouchableOpacity
            style={[styles.switchContainer, { backgroundColor: colorValue }]}
            onPressIn={onPresssIn}
            onPress={onChangeHandler}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.switchThumb,
                    {
                        transform: [{ translateX: ballTranslate }, { scale: ballScaleTranslate }],
                        backgroundColor: ballColor,
                    },
                ]}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    switchContainer: {
        width: 45,
        height: 23,
        borderRadius: 18,
        padding: 3,
        justifyContent: "center",
    },
    switchThumb: {
        width: 19,
        height: 19,
        borderRadius: 20,
    },
})

Switcher.Switch = CustomSwitch
