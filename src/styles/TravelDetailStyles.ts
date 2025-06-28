import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightTravelDetailStyles = StyleSheet.create({
    container: {
        gap: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.white_100,
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        gap: 15,
    },
    specialValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
})

export const travelDetailStyles = {
    light: lightTravelDetailStyles,
    dark: StyleSheet.create({
        container: {
            ...lightTravelDetailStyles.container,
        },
        centered: {
            ...lightTravelDetailStyles.centered,
        },
        card: {
            ...lightTravelDetailStyles.card,
            borderWidth: 1,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        },
        specialValue: {
            ...lightTravelDetailStyles.specialValue,
            color: colors.primary_100,
        },
    })
}