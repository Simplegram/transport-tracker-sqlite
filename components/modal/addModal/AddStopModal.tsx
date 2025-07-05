import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBase, TextInputBlock } from "@/components/input/TextInput"
import VehicleSelector from "@/components/input/VehicleSelector"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import useVehicleTypes from "@/hooks/data/useVehicleTypes"
import useModalHandler from "@/hooks/useModalHandler"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableCoordinates, AddableStop } from "@/src/types/AddableTypes"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { ScrollView, View } from "react-native"
import AddCoordModal from "./AddCoordModal"

export default function AddStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const { completeVehicleTypes: fullVehicleTypes } = useVehicleTypes()

    const [stop, setStop] = useState<AddableStop>({
        name: undefined,
        lat: null,
        lon: null,
        name_alt: null,
        vehicle_type_ids: []
    })
    const [vehicleTypes, setVehicleTypes] = useState<number[]>([])

    const {
        showModal: showCoordModal,
        openModalWithSearch: openCoordModal,
        closeModal: closeCoordModal
    } = useModalHandler()

    const handleCoordSelect = (coordinates: AddableCoordinates) => {
        if (!coordinates.lat || !coordinates.lon) {
            dialog('Input Required', 'Please pick coordinates')
            return
        }

        setStop({ ...stop, lat: coordinates.lat, lon: coordinates.lon })
        closeCoordModal()
    }

    const handleTypeSelect = (vehicle_type_id: number) => {
        if (!vehicleTypes.includes(vehicle_type_id)) {
            setVehicleTypes((prevState) => [...prevState, vehicle_type_id])
        } else {
            const tempArray = [...vehicleTypes]
            const index = tempArray.indexOf(vehicle_type_id)
            tempArray.splice(index, 1)

            setVehicleTypes(tempArray)
        }
    }

    const handleOnSubmit = () => {
        if (!stop.name?.trim() || vehicleTypes.length === 0) {
            dialog('Input Required', 'Please enter stop name and choose a vehicle type')
            return
        }

        const fullData = { ...stop, vehicle_type_ids: vehicleTypes }

        onSubmit(fullData)
    }

    return (
        <>
            <Input.Container>
                <TextInputBlock
                    label="Name"
                    value={stop.name}
                    placeholder="Stop name..."
                    onChangeText={(text) => setStop({ ...stop, "name": text })}
                    onClear={() => setStop({ ...stop, "name": '' })}
                    required
                />

                <View style={inputElementStyles[theme].inputGroup}>
                    <Input.Label>Latitude and Longitude</Input.Label>
                    <View style={inputElementStyles[theme].inputGroupCoord}>
                        <TextInputBase
                            value={stop.lat?.toString()}
                            placeholder="Stop latitude..."
                            onChangeText={(text) => setStop({ ...stop, "lat": Number(text) })}
                            style={{ flex: 1 }}
                        />
                        <TextInputBase
                            value={stop.lon?.toString()}
                            placeholder="Stop longitude..."
                            onChangeText={(text) => setStop({ ...stop, "lon": Number(text) })}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <ModalButton
                        condition={false}
                        value="Pick Latitude and Longitude..."
                        onPress={() => openCoordModal()}
                        style={{ marginTop: 10 }}
                    />
                </View>

                <TextInputBlock
                    label="Alternative name"
                    value={stop.name_alt || ''}
                    placeholder="Alternative name..."
                    onChangeText={(text) => setStop({ ...stop, "name_alt": text })}
                    onClear={() => setStop({ ...stop, "name_alt": '' })}
                />

                <View style={inputElementStyles[theme].inputGroup}>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <Input.Label required={vehicleTypes.length === 0}>Icon</Input.Label>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={"always"}
                        >
                            {fullVehicleTypes.map((type) => (
                                <VehicleSelector
                                    key={type.id}
                                    type={type}
                                    condition={vehicleTypes.includes(type.id)}
                                    onPress={() => handleTypeSelect(type.id)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Input.Container>

            <AddCoordModal
                currentCoordinates={{
                    lat: stop.lat,
                    lon: stop.lon
                }}
                isModalVisible={showCoordModal}
                onClose={closeCoordModal}
                onSelect={handleCoordSelect}
            />

            <Button.Row>
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Add Stop' onPress={handleOnSubmit} />
            </Button.Row>
        </>
    )
}