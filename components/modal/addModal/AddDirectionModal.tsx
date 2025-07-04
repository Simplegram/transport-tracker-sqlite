import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDialog } from "@/context/DialogContext"
import { AddableDirection } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { View } from "react-native"

export default function AddDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()

    const [direction, setDirection] = useState<AddableDirection>({ name: undefined })

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
                <Button.Add label='Add Direction' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}