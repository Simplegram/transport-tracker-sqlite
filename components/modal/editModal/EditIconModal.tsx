import Button from "@/components/button/BaseButton"
import CustomIcon from "@/components/CustomIcon"
import Input from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableIconType } from "@/src/types/AddableTypes"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { View } from "react-native"

export default function EditIconModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const [icon, setIcon] = useState<AddableIconType>(data)
    const [iconQuery, setIconQuery] = useState<string>(data.name)

    const handleOnSubmit = () => {
        if (!icon.name?.trim()) {
            dialog('Input Required', 'Please enter icon name')
            return
        }

        onSubmit(icon)
    }

    const changeIcon = (text: string) => {
        if (!text) {
            setIconQuery(text)
            setIcon({ ...icon, 'name': undefined })
        }
        else {
            setIconQuery(text)
            setIcon({ ...icon, 'name': text })
        }
    }

    return (
        <View>
            <Input.Label required={!iconQuery}>Icon name (FontAwesome6)</Input.Label>
            <Input.Container>
                <View style={[inputElementStyles[theme].inputGroup, inputElementStyles[theme].inputGroupIcon]}>
                    <CustomIcon name={icon.name ? icon.name : 'xmark'} size={32} />
                    <TextInputBase.Clear
                        value={iconQuery}
                        placeholder="e.g., train-subway"
                        onChangeText={changeIcon}
                        containerStyle={{ flex: 1 }}
                        onClear={() => changeIcon('')}
                    />
                </View>
            </Input.Container>

            <Button.Row>
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Save Changes' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}