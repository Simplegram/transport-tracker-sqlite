import { darkenHexColor } from "../utils/colorUtils"

const baseColor = {
    white: '#ffffff',
    black: '#000000',
    primary: '#007bff',
    lightBlue: '#e3f2fd',
    redCancel: '#f0473e',
    greenPositive: '#4CAF50',
    placeholderGray: '#9E9E9E',
}

const white = {
    white_100: darkenHexColor(baseColor.white, 90),
    white_200: darkenHexColor(baseColor.white, 80),
    white_300: darkenHexColor(baseColor.white, 70),
    white_400: darkenHexColor(baseColor.white, 60),
    white_500: darkenHexColor(baseColor.white, 50),
    white_600: darkenHexColor(baseColor.white, 40),
    white_650: darkenHexColor(baseColor.white, 35),
    white_700: darkenHexColor(baseColor.white, 30),
    white_800: darkenHexColor(baseColor.white, 20),
    white_900: darkenHexColor(baseColor.white, 10),
}

const primary = {
    primary_100: darkenHexColor(baseColor.primary, 90),
    primary_300: darkenHexColor(baseColor.primary, 70),
}

export const colors = {
    ...baseColor,
    ...primary,
    ...white,
    redCancel_100: darkenHexColor(baseColor.redCancel, 90),
    greenPositive_100: darkenHexColor(baseColor.greenPositive, 90)
}