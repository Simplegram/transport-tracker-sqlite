import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { IconSelector } from "@/components/input/VehicleSelector"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableVehicleType } from "@/src/types/AddableTravels"
import { VehicleTypeModalProp } from "@/src/types/TravelModal"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export default function AddVehicleTypeModal({ icons, onSubmit, onCancel }: VehicleTypeModalProp) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const [vehicleType, setVehicleType] = useState<AddableVehicleType>({ "name": undefined, "icon_id": undefined })

    const handleOnSubmit = () => {
        if (!vehicleType.name || !vehicleType.icon_id) {
            dialog('Input Required', 'Please enter type name and choose an icon')
            return
        }

        onSubmit(vehicleType)
    }

    return (
        <View>
            {(!icons || icons.length === 0) ? (
                <Input.LoadingLabel />
            ) : (
                <>
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
                                    {icons.map((icon) => (
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
                        <Button.Add label='Add Type' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}