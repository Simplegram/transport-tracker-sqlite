import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import VehicleSelector from "@/components/input/VehicleSelector"
import { useDialog } from "@/context/DialogContext"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import useVehicleTypes from "@/hooks/data/useVehicleTypes"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableRoute } from "@/src/types/AddableTravels"
import { ModalProp } from "@/src/types/TravelModal"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { ScrollView, View } from "react-native"
import EditTravelStopModal from "../travelModal/EditTravelStopModal"

export default function AddRouteModal({ stops, onCancel, onSubmit }: ModalProp) {
    const { dialog } = useDialog()
    const { theme } = useTheme()
    const { setVehicleTypeId } = useModalContext()

    const { vehicleTypes: fullVehicleTypes } = useVehicleTypes()

    const { loading } = useLoading()

    const {
        showModal,
        editingField,
        searchQuery,
        setSearchQuery,
        openModalWithSearch,
        closeModal
    } = useModalHandler()

    const [route, setRoute] = useState<AddableRoute>({
        code: undefined,
        first_stop_id: undefined,
        last_stop_id: undefined,
        name: undefined,
        vehicle_type_id: undefined
    })

    useFocusEffect(
        useCallback(() => {
            setVehicleTypeId(null)
        }, [])
    )

    const handleStopSelect = (stopId: number) => {
        if (!editingField) {
            return
        }

        setRoute({ ...route, [editingField]: stopId })
        closeModal()
    }

    const handleOnSubmit = () => {
        if (!route.name || !route.first_stop_id || !route.last_stop_id || !route.vehicle_type_id) {
            dialog('Input Required', 'Please add name/stops/vehicle type')
            return
        }

        onSubmit(route)
    }

    return (
        <View>
            {loading || !stops ? (
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
                        <TextInputBlock
                            label="Code"
                            value={route.code}
                            placeholder="Route code..."
                            onChangeText={(text) => setRoute({ ...route, "code": text })}
                            onClear={() => setRoute({ ...route, "code": '' })}
                        />

                        <TextInputBlock
                            label="Name"
                            value={route.name}
                            placeholder="Route name..."
                            onChangeText={(text) => setRoute({ ...route, "name": text })}
                            onClear={() => setRoute({ ...route, "name": '' })}
                            required
                        />

                        <ModalButton.Block
                            label="Default First Stop"
                            condition={route.first_stop_id}
                            value={stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}
                            onPress={() => openModalWithSearch('first_stop_id')}
                            required
                        />

                        <ModalButton.Block
                            label="Default Last Stop"
                            condition={route.last_stop_id}
                            value={stops.find(item => item.id === route.last_stop_id)?.name || 'Select Last Stop'}
                            onPress={() => openModalWithSearch('last_stop_id')}
                            required
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Input.Label required={!route.vehicle_type_id}>Type</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {fullVehicleTypes.map((type) => (
                                        <VehicleSelector
                                            key={type.id}
                                            type={type}
                                            condition={route.vehicle_type_id === type.id}
                                            onPress={() => setRoute({ ...route, vehicle_type_id: type.id })}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Input.Container>

                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showModal}
                        searchQuery={searchQuery}
                        vehicleTypeId={route.vehicle_type_id}
                        setSearchQuery={setSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeModal}
                    />

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Add Route' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}