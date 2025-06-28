import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { useRef } from "react"
import { Animated, Easing, EasingFunction, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import Input from "../input/Input"

interface DataButtonProps {
    label: string
    iconName: string
    onPress: () => void
}

export default function DataButton({ label, iconName, onPress }: DataButtonProps) {
    const { theme, getTheme } = useTheme()
    const newTheme = getTheme()

    const itemScale = useRef(new Animated.Value(1)).current
    const itemScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(itemScale, {
            toValue,
            duration: 100,
            easing,
            useNativeDriver: true,
        }).start()
    }

    const backgroundScale = useRef(new Animated.Value(0)).current
    const backgroundScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(backgroundScale, {
            toValue,
            duration: 100,
            easing,
            useNativeDriver: true,
        }).start()
    }

    const onPressIn = () => {
        itemScaleAnimation(0.9, Easing.bounce)
        backgroundScaleAnimation(1, Easing.bounce)
    }

    const onPressOut = () => {
        itemScaleAnimation(1, Easing.bounce)
        backgroundScaleAnimation(0, Easing.bounce)
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[buttonStyles[theme].addButton, { justifyContent: 'center', overflow: 'hidden' }]}
            onPress={onPress}
        >
            <Animated.View style={{
                gap: 5,
                alignItems: 'center',
                transform: [{ scale: itemScale }],
            }}>
                <Icon name={iconName} color={newTheme.palette.textWhite} size={24}></Icon>
                <Input.SubtitleWhite>{label}</Input.SubtitleWhite>
            </Animated.View>
            <Animated.View
                style={{
                    flex: 1,
                    position: 'absolute',
                    backgroundColor: theme === 'light' ? colors.black : colors.white_900,
                    borderRadius: 50,
                    width: 80,
                    height: 80,
                    zIndex: -1,
                    opacity: theme === 'light' ? 0.2 : 1,
                    transform: [{ scale: backgroundScale }],
                }}
            />
        </TouchableOpacity>
    )
}