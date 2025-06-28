import { useTheme } from "@/context/ThemeContext"
import { Pressable, Text, TextProps, View, ViewProps } from "react-native"

export default function Input(props: ViewProps) {
    return (
        <View {...props} />
    )
}

function Container(props: ViewProps) {
    const { style, ...restProps } = props

    return (
        <Input
            style={[
                {
                    gap: 12,
                    paddingBottom: 15,
                }, style
            ]}
            {...restProps}
        />
    )
}

interface RemoveProps {
    onPress: () => void
}

function Remove({ onPress }: RemoveProps) {
    return (
        <Pressable onPress={onPress}>
            <Input.LabelLight style={{ color: 'red' }}>Remove</Input.LabelLight>
        </Pressable>
    )
}

interface TextBaseProps extends TextProps {
    required?: boolean
}

function TextBase({ style, children, required = false, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={{ gap: 2, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text
                style={[
                    {
                        fontSize: 12,
                        fontWeight: '600',

                        color: theme.palette.textBlack,
                    }, style
                ]}
                {...props}
            >{children}</Text>
            {required && <Input.LabelLight style={{ color: 'red' }}>*</Input.LabelLight>}
        </View>
    )
}

function Header({ style, ...props }: TextBaseProps) {
    return (
        <TextBase style={[{ fontSize: 20 }, style]} {...props} />
    )
}

function Title({ style, ...props }: TextBaseProps) {
    return (
        <TextBase style={[{ fontSize: 18 }, style]} {...props} />
    )
}

function TitleDivide({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Title style={[
            {
                width: '100%',

                paddingBottom: 5,
                borderBottomWidth: 0.5,

                borderBottomColor: theme.palette.borderColor,
            }, style
        ]} {...props} />
    )
}

function Subtitle({ style, ...props }: TextBaseProps) {
    return (
        <TextBase style={[{ fontSize: 16 }, style]} {...props} />
    )
}

function SubtitleWhite({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Subtitle style={[{ color: theme.palette.textWhite }, style]} {...props} />
    )
}

function SubtitlePrimary({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Subtitle style={[{ color: theme.palette.textPrimary }, style]} {...props} />
    )
}

function Label({ style, ...props }: TextBaseProps) {
    return (
        <TextBase style={[
            {
                fontSize: 15,
                fontWeight: '500',
                marginBottom: 4,
            }, style
        ]} {...props} />
    )
}

function LabelLight({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Label style={[
            {
                fontSize: 14,
                color: theme.palette.textDark,
            }, style
        ]} {...props} />
    )
}

function ValueText({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TextBase style={[
            {
                fontSize: 14,
                flexShrink: 1,
                fontWeight: 'bold',

                color: theme.palette.textDark,
            }, style
        ]} {...props} />
    )
}

function ValuePrimary({ style, ...props }: TextBaseProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <ValueText style={[
            {
                color: theme.palette.textPrimary,
            }, style
        ]} {...props} />
    )
}

function LoadingLabel(props: TextBaseProps) {
    return (
        <SubtitlePrimary {...props}>Loading...</SubtitlePrimary>
    )
}

Input.Container = Container

Input.Remove = Remove

Input.Text = TextBase

Input.Header = Header

Input.Title = Title
Input.TitleDivide = TitleDivide

Input.Subtitle = Subtitle
Input.SubtitleWhite = SubtitleWhite
Input.SubtitlePrimary = SubtitlePrimary

Input.Label = Label
Input.LabelLight = LabelLight

Input.ValueText = ValueText
Input.ValuePrimary = ValuePrimary

Input.LoadingLabel = LoadingLabel