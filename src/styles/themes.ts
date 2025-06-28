import { colors } from "../const/color"

interface Palette {
    background: string
    backgroundRed: string
    backgroundPrimary: string

    textWhite: string
    textBlack: string
    textDark: string
    textPrimary: string

    textPlaceholder: string
    textHybridWhite: string

    borderColor: string
    borderColorRed: string
    borderColorSoft: string
    borderColorPrimary: string
}

export interface Theme {
    name: string
    palette: Palette
}

const lightPallete: Palette = {
    background: colors.white_100,
    backgroundRed: colors.redCancel,
    backgroundPrimary: colors.primary,

    textWhite: colors.white_100,
    textBlack: colors.black,
    textDark: colors.white_700,
    textPrimary: colors.primary,

    textHybridWhite: colors.white_100,
    textPlaceholder: colors.white_500,

    borderColor: colors.black,
    borderColorRed: colors.black,
    borderColorSoft: colors.white_500,
    borderColorPrimary: colors.black,
}

const darkPallete: Palette = {
    background: colors.black,
    backgroundRed: colors.black,
    backgroundPrimary: colors.black,

    textWhite: colors.white_200,
    textBlack: colors.white_200,
    textDark: colors.white_300,
    textPrimary: colors.primary_100,

    textHybridWhite: colors.primary_100,
    textPlaceholder: colors.white_600,

    borderColor: colors.white_200,
    borderColorRed: colors.redCancel_100,
    borderColorSoft: colors.white_500,
    borderColorPrimary: colors.primary_100,
}

export const lightTheme = {
    name: 'light',
    palette: lightPallete,
}

export const darkTheme = {
    name: 'dark',
    palette: darkPallete,
}

export const themes = {
    light: lightPallete,
    dark: darkTheme,
}

export const defaultTheme = lightTheme