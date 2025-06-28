import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightTravelCardStyles = StyleSheet.create({
    card: {
        gap: 8,
        padding: 12,
        backgroundColor: colors.white_100,
        borderRadius: 10,
        borderColor: '#000',
        height: 290,
        justifyContent: 'space-between',
    },
    stopsTimeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stopTimeBlock: {
        flex: 1,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    stopArrowBlock: {
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lapsSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    notesSection: {},
})

export const travelCardStyles = {
    light: lightTravelCardStyles,
    dark: StyleSheet.create({
        card: {
            ...lightTravelCardStyles.card,
            backgroundColor: colors.black,
            borderColor: colors.white_300,
        },
        stopsTimeSection: {
            ...lightTravelCardStyles.stopsTimeSection,
        },
        stopTimeBlock: {
            ...lightTravelCardStyles.stopTimeBlock,
        },
        stopArrowBlock: {
            ...lightTravelCardStyles.stopArrowBlock,
        },
        lapsSection: {
            ...lightTravelCardStyles.lapsSection,
        },
        notesSection: {
            ...lightTravelCardStyles.notesSection,
        },
    })
}