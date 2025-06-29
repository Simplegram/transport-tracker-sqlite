import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBase, TextInputBlock } from "@/components/input/TextInput"
import VehicleSelector from "@/components/input/VehicleSelector"
import { useDataEditContext } from "@/context/DataEditContext"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import useStopsVehicleTypes from "@/hooks/data/useStopVehicleTypes"
import useVehicleTypes from "@/hooks/data/useVehicleTypes"
import useModalHandler from "@/hooks/useModalHandler"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableCoordinates } from "@/src/types/AddableTravels"
import { CompleteVehicleType } from "@/src/types/CompleteTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useEffect, useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import AddCoordModal from "../addModal/AddCoordModal"
import { sortByIdToFront } from "@/src/utils/utils"

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { getStopVehicleTypesById } = useStopsVehicleTypes()
    const { vehicleTypes: fullVehicleTypes } = useVehicleTypes()

    const [stop, setStop] = useState<EditableStop>(data)
    const [originalTypes, setOriginalTypes] = useState<number[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<number[]>([])
    const [removedTypes, setRemovedTypes] = useState<number[]>([])

    const stopVehicleTypes = getStopVehicleTypesById(data.id)

    const {
        showModal: showCoordModal,
        openModalWithSearch: openCoordModal,
        closeModal: closeCoordModal
    } = useModalHandler()

    const savedVehicleTypeId = useRef(vehicleTypes)

    // console.log(vehicleTypes)
    // console.log(removedTypes)

    useEffect(() => {
        if (stopVehicleTypes) {
            const vehicleTypesArray = stopVehicleTypes.map(item => item.vehicle_type_id)

            setOriginalTypes(vehicleTypesArray)
            setVehicleTypes(vehicleTypesArray)
        }
    }, [])

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
            if (!originalTypes.includes(vehicle_type_id)) setVehicleTypes((prevState) => [...prevState, vehicle_type_id])
            else {
                const tempArray = [...removedTypes]
                const index = tempArray.indexOf(vehicle_type_id)
                console.log(index)
                if (index >= 0) tempArray.splice(index, 1)

                setRemovedTypes(tempArray)
                setVehicleTypes((prevState) => [...prevState, vehicle_type_id])
            }
            if (!removedTypes.includes(vehicle_type_id)) {
                const tempArray = [...removedTypes]
                const index = tempArray.indexOf(vehicle_type_id)
                console.log(index)
                if (index >= 0) tempArray.splice(index, 1)

                setRemovedTypes(tempArray)
            }
        } else {
            const tempArray = [...vehicleTypes]
            const index = tempArray.indexOf(vehicle_type_id)
            tempArray.splice(index, 1)

            if (originalTypes.includes(vehicle_type_id)) setRemovedTypes((prevState) => [...prevState, vehicle_type_id])
            setVehicleTypes(tempArray)
        }
    }

    const handleOnSubmit = () => {
        if (!stop.name.trim() || vehicleTypes.length === 0) {
            dialog('Input Required', 'Please enter stop name and choose a vehicle type')
            return
        }

        const newAddedTypes = vehicleTypes.filter(item => originalTypes.indexOf(item) < 0)
        const fullData = { ...stop, vehicle_type_ids: newAddedTypes, removed_type_ids: removedTypes }
        // console.log(fullData)

        onSubmit(fullData)
    }

    return (
        <View>
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
                            {sortByIdToFront(fullVehicleTypes, originalTypes).map((type: CompleteVehicleType) => (
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
                <Button.Add label='Edit Stop' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}