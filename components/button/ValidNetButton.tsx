import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import Button, { Props as BaseButtonProps } from "./BaseButton"

export default function NetButton({ disabled, style, textStyle, onPress, label, ...props }: BaseButtonProps) {
    const { theme } = useTheme()

    return (
        <Button
            label={label}
            style={[buttonStyles[theme].addButton]}
            onPress={onPress}
            {...props}
        />
    )
}

function NetButtonBlock(props: BaseButtonProps) {
    return (
        <Button.Row style={{ flexDirection: 'column' }}>
            <NetButton {...props} />
        </Button.Row>
    )
}

NetButton.Block = NetButtonBlock