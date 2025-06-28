import { useTheme } from "@/context/ThemeContext"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import CustomIcon from "../CustomIcon"
import HighlightedText from "../HighlightedText"
import Input from "../input/Input"

interface ModalButtonProps {
    label?: string
    condition: any
    value: any
    style?: StyleProp<ViewStyle>
    children?: React.ReactNode
    onPress: () => void
}

export function ModalButton({ condition, value, style, children, onPress }: ModalButtonProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    minHeight: 48,
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 14,

                    borderColor: theme.palette.borderColorSoft,
                    backgroundColor: theme.palette.background,
                },
                condition && { borderColor: theme.palette.borderColor, fontWeight: '900' },
                style
            ]}
        >
            <HighlightedText condition={condition}>
                {value}
            </HighlightedText>
            {children}
        </Pressable>
    )
}

interface ButtonClear extends ModalButtonProps {
    onClear?: () => void
}

function ModalButtonWithClear({ onClear, ...props }: ButtonClear) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <ModalButton {...props} style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {onClear && props.condition && (
                <Pressable onPress={onClear}>
                    <CustomIcon name='xmark' style={[
                        {
                            paddingLeft: 5,

                            color: theme.palette.borderColorSoft,
                        }, props.condition && { color: theme.palette.borderColor }
                    ]} />
                </Pressable>
            )}
        </ModalButton>
    )
}

interface ButtonBlockProps extends ButtonClear {
    required?: boolean
}

function ModalButtonBlock({ required = false, ...props }: ButtonBlockProps) {
    return (
        <Input>
            <Input.Label required={required ? (props.condition ? false : true) : false}>{props.label}</Input.Label>
            <ModalButtonWithClear
                style={props.style}
                value={props.value}
                condition={props.condition}
                onPress={props.onPress}
                onClear={props.onClear}
            />
        </Input>
    )
}

ModalButton.Block = ModalButtonBlock