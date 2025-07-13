import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useDialog } from "@/context/DialogContext"
import { AddableTripTemplate } from "@/src/types/data/TripTemplates"
import { StandaloneModalProps } from "@/src/types/StandaloneModalTypes"
import moment from "moment-timezone"
import { useState } from "react"

export default function AddTripTemplate(props: StandaloneModalProps) {
    const { dialog } = useDialog()

    const [tripTemplate, setTripTemplate] = useState<AddableTripTemplate>({ name: '', created_at: moment().toISOString(), description: null })

    const handleOnSubmit = () => {
        if (!tripTemplate.name) {
            dialog('Input Required', 'Please enter trip template name')
            return
        }

        props.onSubmit(tripTemplate)

        setTripTemplate({ name: '', created_at: moment().toISOString(), description: null })
    }

    return (
        <ModalTemplate.Bottom visible={props.isModalVisible}>
            <ModalTemplate.BottomContainer title="Add Trip Template">
                <Input.Container>
                    <TextInputBlock
                        label="Name"
                        value={tripTemplate.name}
                        placeholder="Trip template name..."
                        onChangeText={(text) => setTripTemplate({ ...tripTemplate, name: text })}
                        onClear={() => setTripTemplate({ ...tripTemplate, name: '' })}
                        required
                    />

                    <TextInputBlock
                        label="Description"
                        value={tripTemplate.description || ''}
                        placeholder="Trip template description..."
                        onChangeText={(text) => setTripTemplate({ ...tripTemplate, description: text })}
                        onClear={() => setTripTemplate({ ...tripTemplate, description: null })}
                    />
                </Input.Container>

                <Button.Row>
                    <Button.Dismiss label='Cancel' onPress={props.onClose} />
                    <Button.Add label='Add Trip Template' onPress={handleOnSubmit} />
                </Button.Row>
            </ModalTemplate.BottomContainer>
        </ModalTemplate.Bottom>
    )
}