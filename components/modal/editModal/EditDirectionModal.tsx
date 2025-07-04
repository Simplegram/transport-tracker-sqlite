import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useDialog } from "@/context/DialogContext"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { Direction } from "@/src/types/Travels"
import { useState } from "react"
import { View } from "react-native"

export default function EditDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()

    const { modalData: data } = useDataEditContext()

    const [direction, setDirection] = useState<Direction>(data)

    const handleOnSubmit = () => {
        if (!direction.name?.trim()) {
            dialog('Input Required', 'Please enter direction name')
            return
        }

        onSubmit(direction)
    }

    return (
        <View>
            <Input.Container>
                <TextInputBlock
                    value={direction.name}
                    label="Name"
                    placeholder="Direction name..."
                    onChangeText={(text) => setDirection({ ...direction, "name": text })}
                    onClear={() => setDirection({ ...direction, "name": '' })}
                    required
                />
            </Input.Container>

            <Button.Row>
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Edit Route' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}