import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useDialog } from "@/context/DialogContext"
import useRideTemplates from "@/hooks/data/templates/useRideTemplates"
import useRoutes from "@/hooks/data/useRoutes"
import useStops from "@/hooks/data/useStops"
import { useToggleLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { RideTemplate } from "@/src/types/data/RideTemplates"
import { EditableRideModalProps } from "@/src/types/StandaloneModalTypes"
import { useEffect, useState } from "react"
import EditRideRouteModal from "../rideModal/EditRideRouteModal"
import EditRideStopModal from "../rideModal/EditRideStopModal"

export default function EditRideTemplate(props: EditableRideModalProps) {
    const { dialog } = useDialog()
    const { loading, toggleLoading } = useToggleLoading(100)

    const { getRideTemplateById } = useRideTemplates()

    const { completeRoutes } = useRoutes()
    const { completeStops } = useStops()

    const {
        showModal: showRouteModal,
        searchQuery: routeSearchQuery,
        setSearchQuery: setRouteSearchQuery,
        openModalWithSearch: openRouteModal,
        closeModal: closeRouteModal
    } = useModalHandler()

    const {
        showModal: showStopModal,
        editingField: stopEditingField,
        searchQuery: stopSearchQuery,
        setSearchQuery: setStopSearchQuery,
        openModalWithSearch: openStopModal,
        closeModal: closeStopModal
    } = useModalHandler()

    const [rideTemplate, setRideTemplate] = useState<RideTemplate | null>(null)

    useEffect(() => {
        toggleLoading()

        const retrievedRideTemplates = getRideTemplateById(props.rideTemplateId)

        if (retrievedRideTemplates && retrievedRideTemplates.length > 0) {
            const retrievedRideTemplate = retrievedRideTemplates[0]
            setRideTemplate({
                id: retrievedRideTemplate.id,
                trip_template_id: retrievedRideTemplate.trip_template_id,
                sequence_order: retrievedRideTemplate.sequence_order,
                route_id: retrievedRideTemplate.route_id,
                vehicle_type_id: retrievedRideTemplate.vehicle_type_id,
                first_stop_id: retrievedRideTemplate.first_stop_id,
                last_stop_id: retrievedRideTemplate.last_stop_id,
                notes: retrievedRideTemplate.notes
            })
        }
    }, [props.isModalVisible])

    const handleRouteSelect = (routeId: number) => {
        const selectedRoute = completeRoutes.find(route => route.id === routeId)
        if (rideTemplate && selectedRoute) {
            setRideTemplate({
                ...rideTemplate,
                route_id: routeId,
                vehicle_type_id: selectedRoute.vehicle_type.id,
                first_stop_id: selectedRoute.first_stop_id,
                last_stop_id: selectedRoute.last_stop_id,
            })
        }
        closeRouteModal()
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && rideTemplate) {
            setRideTemplate({ ...rideTemplate, [stopEditingField]: stopId })
        }
        closeStopModal()
    }

    const handleOnSubmit = () => {
        if (rideTemplate && !rideTemplate.route_id) {
            dialog('Input Required', 'Please enter trip template name')
            return
        }

        props.onSubmit(rideTemplate)

        setRideTemplate(null)
    }

    return (
        <ModalTemplate.Bottom visible={props.isModalVisible}>
            {loading || !rideTemplate ? (
                <></>
            ) : (
                <>
                    <ModalTemplate.BottomContainer title="Edit Ride Template Details">
                        <Input.Container>
                            <ModalButton.Block
                                label='Route'
                                condition={rideTemplate.route_id}
                                value={rideTemplate.route_id ? `${completeRoutes.find(route => route.id === rideTemplate.route_id)?.code || ''} | ${completeRoutes.find(route => route.id === rideTemplate.route_id)?.name || ''}` : 'Select Route...'}
                                onPress={() => openRouteModal()}
                                required
                            />

                            <ModalButton.Block
                                label='Default First Stop'
                                condition={rideTemplate.first_stop_id}
                                value={completeStops.find(stop => stop.id === rideTemplate.first_stop_id)?.name || 'Select default first stop...'}
                                onPress={() => openStopModal('first_stop_id')}
                                required
                            />

                            <ModalButton.Block
                                label='Default Last Stop'
                                condition={rideTemplate.last_stop_id}
                                value={completeStops.find(stop => stop.id === rideTemplate.last_stop_id)?.name || 'Select default last stop...'}
                                onPress={() => openStopModal('last_stop_id')}
                                required
                            />

                            {(rideTemplate.first_stop_id || rideTemplate.last_stop_id) && (
                                <Button.Dismiss style={{ flex: 0 }} onPress={() => {
                                    const first_id = rideTemplate.first_stop_id

                                    setRideTemplate({ ...rideTemplate, first_stop_id: rideTemplate.last_stop_id, last_stop_id: first_id })
                                }}>Switch Stop</Button.Dismiss>
                            )}

                            <TextInputBlock
                                label="Notes"
                                value={rideTemplate.notes || ''}
                                placeholder="Ride template notes..."
                                onChangeText={(text) => setRideTemplate({ ...rideTemplate, notes: text })}
                                onClear={() => setRideTemplate({ ...rideTemplate, notes: '' })}
                            />
                        </Input.Container>

                        <Button.Row>
                            <Button.Dismiss label='Cancel' onPress={props.onClose} />
                            <Button.Add label='Add Ride Template' onPress={handleOnSubmit} />
                        </Button.Row>
                    </ModalTemplate.BottomContainer>

                    <EditRideRouteModal
                        routes={completeRoutes}
                        isModalVisible={showRouteModal}
                        searchQuery={routeSearchQuery}
                        setSearchQuery={setRouteSearchQuery}
                        onSelect={handleRouteSelect}
                        onClose={closeRouteModal}
                    />

                    <EditRideStopModal
                        stops={completeStops}
                        isModalVisible={showStopModal}
                        searchQuery={stopSearchQuery}
                        vehicleTypeId={rideTemplate.vehicle_type_id}
                        setSearchQuery={setStopSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeStopModal}
                    />
                </>
            )}
        </ModalTemplate.Bottom>
    )
}