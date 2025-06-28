import { StyleSheet } from "react-native"

const lightModalElementStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})

export const modalElementStyles = {
    light: lightModalElementStyles,
    dark: StyleSheet.create({
        header: {
            ...lightModalElementStyles.header,
        },
    })
}

const lightModalStyles = StyleSheet.create({
    inputContainer: {
        gap: 10,
        minHeight: 125,
        maxHeight: 325,
        flexDirection: 'column',
    },
    emptyList: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export const modalStyles = {
    light: lightModalStyles,
    dark: StyleSheet.create({
        inputContainer: {
            ...lightModalStyles.inputContainer,
        },
        emptyList: {
            ...lightModalStyles.emptyList,
        },
    })
}

