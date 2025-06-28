import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightButtonStyles = StyleSheet.create({
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
})

export const buttonStyles = {
    light: lightButtonStyles,
    dark: StyleSheet.create({
        addButton: {
            ...lightButtonStyles.addButton,
            borderColor: colors.primary_100,
            backgroundColor: colors.black,
        },
        addButtonText: {
            ...lightButtonStyles.addButtonText,
            color: colors.white_100,
        },
    })
}