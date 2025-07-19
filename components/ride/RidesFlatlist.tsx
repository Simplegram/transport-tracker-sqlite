import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { PropsWithChildren } from "react"
import { StyleSheet, Text, useWindowDimensions, View } from "react-native"

interface HeaderComponentProps extends PropsWithChildren {
    minScale: number
}

export function EmptyHeaderComponent({ children, minScale = 0.4 }: HeaderComponentProps) {
    const { height } = useWindowDimensions()

    return (
        <View style={{
            flex: 1,
            height: height * minScale,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </View>
    )
}

interface TravelHeaderProps {
    index: number
    directionNameKey: string
    directionNamesLength: number
}

export function Header({ index, directionNameKey, directionNamesLength }: TravelHeaderProps) {
    const { theme } = useTheme()

    return (
        <View
            style={{
                gap: 5,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={styles[theme].title}>
                Direction ({index + 1}/{directionNamesLength}):
            </Text>
            <Text style={styles[theme].title}>
                {directionNameKey}
            </Text>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50'
    },
})

const styles = {
    light: { ...lightStyles, label: lightStyles.title },
    dark: StyleSheet.create({
        title: {
            ...lightStyles.title,
            color: colors.white_300,
        },
        label: {
            ...lightStyles.title,
            color: colors.white_100,
        },
    })
}