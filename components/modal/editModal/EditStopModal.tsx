import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBase, TextInputBlock } from "@/components/input/TextInput"
import VehicleSelector from "@/components/input/VehicleSelector"
import { useDataEditContext } from "@/context/DataEditContext"
import { useDialog } from "@/context/DialogContext"
import { useTheme } from "@/context/ThemeContext"
import useVehicleTypes from "@/hooks/data/useVehicleTypes"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableCoordinates } from "@/src/types/AddableTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { VehicleType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import AddCoordModal from "../addModal/AddCoordModal"

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { vehicleTypes: fullVehicleTypes } = useVehicleTypes()
    const [stop, setStop] = useState<EditableStop>({ ...data, vehicle_type: data.vehicle_type?.id })

    const { loading } = useLoading()

    const {
        showModal: showCoordModal,
        openModalWithSearch: openCoordModal,
        closeModal: closeCoordModal
    } = useModalHandler()

    const savedVehicleTypeId = useRef(stop.vehicle_type_id)

    const handleCoordSelect = (coordinates: AddableCoordinates) => {
        if (!coordinates.lat || !coordinates.lon) {
            dialog('Input Required', 'Please pick coordinates')
            return
        }

        setStop({ ...stop, lat: coordinates.lat, lon: coordinates.lon })
        closeCoordModal()
    }

    const handleOnSubmit = () => {
        if (!stop.name.trim() || !stop.vehicle_type_id) {
            dialog('Input Required', 'Please enter stop name and choose a vehicle type')
            return
        }

        onSubmit(stop)
    }

    return (
        <View>
            {loading ? (
                <Input.LoadingLabel />
            ) : (
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
                                <Input.Label required={!stop.vehicle_type_id}>Icon</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {sortByIdToFront(fullVehicleTypes, savedVehicleTypeId.current).map((type: VehicleType) => (
                                        <VehicleSelector
                                            key={type.id}
                                            type={type}
                                            condition={stop.vehicle_type_id === type.id}
                                            onPress={() => setStop({ ...stop, vehicle_type_id: type.id })}
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
                </>
            )}
        </View>
    )
}