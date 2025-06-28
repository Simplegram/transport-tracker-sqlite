import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { Pressable, StyleProp, TextInput, TextInputProps, View, ViewStyle } from "react-native"
import CustomIcon from "../CustomIcon"
import Input from "./Input"

export function TextInputBase(props: TextInputProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { placeholderTextColor, value, style, ...restOfProps } = props

    return (
        <TextInput
            value={props.value || ''}
            style={[
                {
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    minHeight: 48,
                    fontSize: 14,
                    fontWeight: '200',
                    borderWidth: 1,

                    color: theme.palette.textDark,
                    borderColor: theme.palette.borderColorSoft,
                    backgroundColor: theme.palette.background,
                },
                props.value && { borderColor: theme.palette.borderColor, fontWeight: '900' },
                props.style
            ]}
            placeholderTextColor={theme.palette.textPlaceholder}
            {...restOfProps}
        />
    )
}

interface InputClearProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>
    onClear?: () => void
}

function TextInputWithClear({ onClear, style, containerStyle, value, ...props }: InputClearProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={[
            {
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: 'row',

                borderColor: theme.palette.borderColorSoft,
                backgroundColor: theme.palette.background,
            },
            value && { borderColor: theme.palette.borderColor },
            containerStyle
        ]}>
            <TextInputBase style={[{ flex: 1, borderWidth: 0 }, style]} value={value} {...props} />
            {onClear && value && (
                <Pressable onPress={onClear}>
                    <CustomIcon name='xmark' style={[
                        {
                            paddingLeft: 5,
                            paddingRight: 15,

                            color: theme.palette.borderColorSoft,
                        }, value && { color: theme.palette.borderColor }
                    ]} />
                </Pressable>
            )}
        </View>
    )
}

function TextInputNumeric(props: TextInputProps) {
    const { textAlign, keyboardType, ...restOfProps } = props

    return (
        <TextInputBase
            style={{ width: '100%' }}
            textAlign='center'
            keyboardType="numeric"
            {...restOfProps}
        />
    )
}

interface TextInputBlockProps extends InputClearProps {
    label: string
    required?: boolean
}

export function TextInputBlock({ style, required = false, ...props }: TextInputBlockProps) {
    const { theme } = useTheme()

    const { label, ...restOfProps } = props

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            {props.label && <Input.Label required={required ? (props.value ? false : true) : false}>{props.label}</Input.Label>}
            <TextInputWithClear style={style} {...restOfProps} />
        </View>
    )
}

function TextInputMultiline(props: TextInputBlockProps) {
    const { multiline, ...restOfProps } = props

    return (
        <TextInputBlock
            style={{
                minHeight: 100,
                textAlignVertical: 'top',
            }}
            multiline={true}
            numberOfLines={4}
            {...restOfProps}
        />
    )
}

TextInputBase.Clear = TextInputWithClear

TextInputBase.Numeric = TextInputNumeric

TextInputBlock.Multiline = TextInputMultiline