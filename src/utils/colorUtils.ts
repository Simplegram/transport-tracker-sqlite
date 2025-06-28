import { StyleProp, TextStyle, ViewStyle } from "react-native"

export const darkenColor = (hexColor: string, amount: number) => {
    // Remove the '#' if it exists
    hexColor = hexColor.replace('#', '')

    // Parse the hex color into its RGB components
    const r = parseInt(hexColor.substring(0, 2), 16)
    const g = parseInt(hexColor.substring(2, 4), 16)
    const b = parseInt(hexColor.substring(4, 6), 16)

    // Darken each component
    const darkenR = Math.max(0, Math.floor(r * (1 - amount)))
    const darkenG = Math.max(0, Math.floor(g * (1 - amount)))
    const darkenB = Math.max(0, Math.floor(b * (1 - amount)))

    // Convert the darkened components back to hex
    const darkenRHex = darkenR.toString(16).padStart(2, '0')
    const darkenGHex = darkenG.toString(16).padStart(2, '0')
    const darkenBHex = darkenB.toString(16).padStart(2, '0')

    return `#${darkenRHex}${darkenGHex}${darkenBHex}`
}

export const darkenHexColor = (hexColor: string, darkenPercentage: number): string => {
    if (!/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(hexColor)) {
        console.error('Invalid hex color format:', hexColor)
        return hexColor
    }

    const cleanedHex = hexColor.replace(/^#/, '')

    const fullHex = cleanedHex.length === 3
        ? cleanedHex.split('').map(char => char + char).join('')
        : cleanedHex

    const r = parseInt(fullHex.substring(0, 2), 16)
    const g = parseInt(fullHex.substring(2, 4), 16)
    const b = parseInt(fullHex.substring(4, 6), 16)

    const reductionAmount = Math.max(0, Math.min(100, darkenPercentage)) / 100

    const darkenedR = Math.floor(r * reductionAmount)
    const darkenedG = Math.floor(g * reductionAmount)
    const darkenedB = Math.floor(b * reductionAmount)

    const finalR = Math.max(0, Math.min(255, darkenedR))
    const finalG = Math.max(0, Math.min(255, darkenedG))
    const finalB = Math.max(0, Math.min(255, darkenedB))

    const toHex = (c: number): string => {
        const hex = c.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`
}


export const getBackgroundColorFromStyle = (buttonStyle: StyleProp<ViewStyle>): string | undefined => {
    if (!buttonStyle) {
        return undefined
    }

    if (Array.isArray(buttonStyle)) {
        // If it's an array of styles, iterate and find the last one with backgroundColor
        for (let i = buttonStyle.length - 1; i >= 0; i--) {
            const styleObject = buttonStyle[i]
            if (styleObject && typeof styleObject === 'object' && 'backgroundColor' in styleObject) {
                return styleObject.backgroundColor as string
            }
        }
    } else if (typeof buttonStyle === 'object' && buttonStyle !== null && 'backgroundColor' in buttonStyle) {
        // If it's a single style object
        return (buttonStyle as ViewStyle).backgroundColor as string
    }

    return undefined
}

export const getColorFromStyle = (textStyle: StyleProp<TextStyle>): string | undefined => {
    if (!textStyle) {
        return undefined
    }

    if (Array.isArray(textStyle)) {
        // If it's an array of styles, iterate and find the last one with color
        for (let i = textStyle.length - 1; i >= 0; i--) {
            const styleObject = textStyle[i]
            if (styleObject && typeof styleObject === 'object' && 'color' in styleObject) {
                return styleObject.color as string
            }
        }
    } else if (typeof textStyle === 'object' && textStyle !== null && 'color' in textStyle) {
        // If it's a single style object
        return (textStyle as TextStyle).color as string
    }

    return undefined
}

export const hexToRgbA = (hex: string) => {
    let c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
    }
    throw new Error('Bad Hex')
}