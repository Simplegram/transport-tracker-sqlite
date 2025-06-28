import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { useNetInfoInstance } from "@react-native-community/netinfo"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import Button, { Props as BaseButtonProps } from "./BaseButton"

export default function NetButton({ disabled, style, textStyle, onPress, label, ...props }: BaseButtonProps) {
    const { theme } = useTheme()
    const { netInfo, refresh } = useNetInfoInstance()

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [])
    )

    return (
        <Button
            disabled={netInfo.isInternetReachable === false}
            label={(netInfo.isInternetReachable === false) ? 'No Internet' : label}
            style={[buttonStyles[theme].addButton, (netInfo.isInternetReachable === false) && { opacity: 0.6 }]}
            onPress={onPress}
            {...props}
        />
    )
}

function NetButtonBlock(props: BaseButtonProps) {
    return (
        <Button.Row style={{ flexDirection: 'column' }}>
            <NetButton {...props} />
        </Button.Row>
    )
}

NetButton.Block = NetButtonBlock