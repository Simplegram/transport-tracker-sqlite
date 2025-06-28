import { useTheme } from "@/context/ThemeContext"
import { View } from "react-native"

interface DividerProp {
    paddingSize?: number
    width?: number
}

export default function Divider({ paddingSize = 5, width = 0.75 }: DividerProp) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={{
            paddingTop: paddingSize,
            marginBottom: paddingSize,
            borderBottomWidth: width,

            borderColor: theme.palette.borderColorSoft,
        }} />
    )
}