import { useTheme } from "@/context/ThemeContext"
import { View, ViewProps } from "react-native"

export default function Container({ style, ...props }: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View
            style={[
                {
                    gap: 10,
                    flexGrow: 1,
                    paddingTop: 5,
                    paddingBottom: 15,
                    paddingHorizontal: 15,
                    justifyContent: 'center',

                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...props}
        >
            {props.children}
        </View>
    )
}

function DetailRow({ style, ...props }: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View
            style={[
                {
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 10,
                    flexDirection: 'column',
                    justifyContent: 'space-between',

                    borderColor: theme.palette.borderColor,
                }, style
            ]}
            {...props}
        ></View>
    )
}

Container.DetailRow = DetailRow