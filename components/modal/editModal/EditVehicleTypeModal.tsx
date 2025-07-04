import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { IconSelector } from "@/components/input/VehicleSelector"
import { useDataEditContext } from "@/context/DataEditContext"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import useIcons from "@/hooks/data/useIcons"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { EditableVehicleType } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { IconType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useEffect, useRef, useState } from "react"
import { ScrollView, View } from "react-native"

export default function EditVehicleTypeModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { icons, getIcons } = useIcons()

    const [vehicleType, setVehicleType] = useState<EditableVehicleType>(data)
    const savedVehicleTypeId = useRef(vehicleType.icon_id)

    useEffect(() => {
        getIcons()
    }, [icons])

    const handleOnSubmit = () => {
        if (!vehicleType.name || !vehicleType.icon_id) {
            dialog('Input Required', 'Please enter type name and choose an icon')
            return
        }

        onSubmit(vehicleType)
    }

    return (
        <View>
            <Input.Container>
                <TextInputBlock
                    label="Name"
                    value={vehicleType.name}
                    placeholder="e.g., Standard Bus"
                    onChangeText={(text) => setVehicleType({ ...vehicleType, "name": text })}
                    onClear={() => setVehicleType({ ...vehicleType, "name": '' })}
                    required
                />

                <View style={inputElementStyles[theme].inputGroup}>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <Input.Label required={!vehicleType.icon_id}>Icon</Input.Label>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={"always"}
                        >
                            {sortByIdToFront(icons, savedVehicleTypeId.current).map((icon: IconType) => (
                                <IconSelector
                                    key={icon.id}
                                    icon={icon}
                                    condition={vehicleType.icon_id === icon.id}
                                    onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Input.Container>

            <Button.Row>
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Edit Type' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}