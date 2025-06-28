import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightInputElementStyles = StyleSheet.create({
    inputGroup: {},
    inputLargeGroup: {
        gap: 16,
    },
    inputGroupCoord: {
        flex: 1,
        gap: 8,
        flexDirection: 'row',
    },
    inputGroupIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    unselectedLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white_500,
    },
    selectedLabel: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.white_700,
    },
})

export const inputElementStyles = {
    light: lightInputElementStyles,
    dark: StyleSheet.create({
        inputGroup: {
            ...lightInputElementStyles.inputGroup,
        },
        inputLargeGroup: {
            ...lightInputElementStyles.inputLargeGroup,
        },
        inputGroupCoord: {
            ...lightInputElementStyles.inputGroupCoord,
        },
        inputGroupIcon: {
            ...lightInputElementStyles.inputGroupIcon,
        },
        unselectedLabel: {
            ...lightInputElementStyles.unselectedLabel,
            color: colors.white_600,
        },
        selectedLabel: {
            ...lightInputElementStyles.selectedLabel,
            color: colors.white_300,
        }
    })
}

