import Button from "@/components/button/BaseButton"
import Divider from "@/components/Divider"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useDialog } from "@/context/DialogContext"
import { useTemplateContext } from "@/context/TemplateContext"
import useTripTemplates from "@/hooks/data/templates/useTripTemplates"
import { useToggleLoading } from "@/hooks/useLoading"
import { TripTemplate } from "@/src/types/data/TripTemplates"
import { EditableTripModalProps } from "@/src/types/StandaloneModalTypes"
import { router } from "expo-router"
import { useEffect, useState } from "react"

export default function EditTripTemplate(props: EditableTripModalProps) {
    const { dialog } = useDialog()
    const { loading, toggleLoading } = useToggleLoading(100)
    const { setTripTemplateId } = useTemplateContext()

    const { getTripTemplateById } = useTripTemplates()

    const [tripTemplate, setTripTemplate] = useState<TripTemplate | null>(null)

    useEffect(() => {
        toggleLoading()

        const retrievedTripTemplate = getTripTemplateById(props.tripTemplateId)

        if (retrievedTripTemplate) {
            setTripTemplate({
                id: retrievedTripTemplate.id,
                created_at: retrievedTripTemplate.created_at,
                name: retrievedTripTemplate.name,
                description: retrievedTripTemplate.description
            })
        }
    }, [props.isModalVisible])

    const handleOnSubmit = () => {
        if (tripTemplate && !tripTemplate.name) {
            dialog('Input Required', 'Please enter trip template name')
            return
        }

        props.onSubmit(tripTemplate)
    }

    const handleOpenTemplateEditor = () => {
        if (tripTemplate) setTripTemplateId(tripTemplate.id)
        props.onClose()
        router.push('/(tabs)/manage/templateEditor')
    }

    return (
        <ModalTemplate.Bottom visible={props.isModalVisible}>
            {loading || !tripTemplate ? (
                <></>
            ) : (
                <ModalTemplate.BottomContainer title="Edit Trip Template Details">
                    <Input.Container style={{ paddingBottom: 0 }}>
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

                        <Button.Row>
                            <Button.Add label='Open Template Editor' onPress={handleOpenTemplateEditor} />
                        </Button.Row>
                    </Input.Container>

                    <Divider />

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={props.onClose} />
                        <Button.Add label='Save Changes' onPress={handleOnSubmit} />
                    </Button.Row>
                </ModalTemplate.BottomContainer>
            )}
        </ModalTemplate.Bottom>
    )
}