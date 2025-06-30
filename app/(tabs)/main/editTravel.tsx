import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import NetButton from '@/components/button/ValidNetButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { ManageableLap } from '@/components/modal/FlatlistPicker'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelLapsModal from '@/components/modal/travelModal/EditTravelLapsModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { useDialog } from '@/context/DialogContext'
import { useModalContext } from '@/context/ModalContext'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import useDirections from '@/hooks/data/useDirections'
import useLaps from '@/hooks/data/useLaps'
import useRoutes from '@/hooks/data/useRoutes'
import useStops from '@/hooks/data/useStops'
import useTravels from '@/hooks/data/useTravels'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import { useToggleLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap } from '@/src/types/AddableTravels'
import { EditableTravel } from '@/src/types/EditableTravels'
import { getDateToIsoString } from '@/src/utils/dateUtils'
import { datetimeFieldToCapitals, formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import React, { useState } from 'react'
import {
    View
} from 'react-native'

export default function EditTravelItem() {
    const { theme } = useTheme()
    const { dialog } = useDialog()

    const { selectedItem: data } = useTravelContext()
    const { setVehicleTypeId } = useModalContext()

    const { loading, setLoading } = useToggleLoading()

    const { directions, getDirections } = useDirections()
    const { completeStops, getCompleteStops } = useStops()
    const { completeRoutes, getCompleteRoutes } = useRoutes()
    const { completeVehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()
    const { laps, getLapsByTravelId, setLaps } = useLaps()

    const { editTravel } = useTravels()

    const refetchTravelData = async () => {
        getDirections()

        getCompleteStops()
        getCompleteRoutes()
        getCompleteVehicleTypes()
    }

    const [lapsCount, setLapsCount] = useState<number>(0)
    const [travel, setTravel] = useState<EditableTravel | null>()

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            setLapsCount(laps.length)
        }, [laps])
    )

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()

            if (data) {
                setTravel({
                    id: data.id,
                    bus_final_arrival: data.bus_final_arrival,
                    bus_initial_arrival: data.bus_initial_arrival,
                    bus_initial_departure: data.bus_initial_departure,
                    notes: data.notes,
                    vehicle_code: data.vehicle_code,
                    direction_id: data.direction.id,
                    first_stop_id: data.first_stop.id,
                    last_stop_id: data.last_stop.id,
                    route_id: data.route.id,
                    vehicle_type_id: data.vehicle_type.id,
                })

                setVehicleTypeId(data.vehicle_type_id)

                getLapsByTravelId(data.id)
            }
        }, [data])
    )

    const {
        showModal: showDatetimeModal,
        editingField: datetimeField,
        openModalWithSearch: openDatetimeModal,
        closeModal: closeDatetimeModal
    } = useModalHandler()

    const {
        showModal: showStopModal,
        editingField: stopEditingField,
        searchQuery: stopSearchQuery,
        setSearchQuery: setStopSearchQuery,
        openModalWithSearch: openStopModal,
        closeModal: closeStopModal
    } = useModalHandler()

    const {
        showModal: showRouteModal,
        searchQuery: routeSearchQuery,
        setSearchQuery: setRouteSearchQuery,
        openModalWithSearch: openRouteModal,
        closeModal: closeRouteModal
    } = useModalHandler()

    const {
        showModal: showDirectionModal,
        searchQuery: directionSearchQuery,
        setSearchQuery: setDirectionSearchQuery,
        openModalWithSearch: openDirectionModal,
        closeModal: closeDirectionModal
    } = useModalHandler()

    const {
        showModal: showLapsModal,
        openModalWithSearch: openLapsModal,
        closeModal: closeLapsModal
    } = useModalHandler()

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = getDateToIsoString(selectedDate)

        if (datetimeField) {
            setTravel(prev => prev ? ({ ...prev, [datetimeField]: isoSelectedDate }) : null)
        }
        closeDatetimeModal()
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && travel) {
            setTravel(prev => {
                if (prev) return {
                    ...prev,
                    [stopEditingField]: stopId
                }
            })
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => {
                if (prev) return {
                    ...prev,
                    route_id: routeId,
                    vehicle_type_id: completeRoutes.find(route => route.id === routeId)!.vehicle_type.id,
                    first_stop_id: completeRoutes.find(route => route.id === routeId)!.first_stop_id,
                    last_stop_id: completeRoutes.find(route => route.id === routeId)!.last_stop_id,
                }
            })
        }
        closeRouteModal()
    }

    const handleDirectionSelect = (directionId: number) => {
        if (travel) {
            setTravel({ ...travel, direction_id: directionId })
        }

        closeDirectionModal()
    }

    const handleLapsSelect = (laps: ManageableLap[]) => {
        if (laps) setLaps(laps)

        closeLapsModal()
    }

    const handleOnSubmit = () => {
        if (!travel) {
            dialog('Input Required', 'Data is broken.')
            return
        }

        if (
            !travel.direction_id ||
            !travel.first_stop_id ||
            !travel.last_stop_id ||
            !travel.route_id ||
            !travel.vehicle_type_id
        ) {
            dialog('Input Required', 'Please choose a route/direction/stops.')
            return
        }

        setLoading(true)

        editTravel(travel)

        if (laps) {
            const idedLaps = laps.map(lap => { return { ...lap, travel_id: travel.id } })

            const lapsToEdit = idedLaps.filter(lap => typeof lap.id === 'number' && !lap.status)
            const lapsToAdd = idedLaps.filter(lap => typeof lap.id === 'string')
            const lapsToDelete = idedLaps.filter(lap => lap.status === 'deleted')


            const cleanedLapsToAdd = lapsToAdd.map(item => {
                if (typeof item.id === 'string') {
                    const { id, ...cleanNewLap } = item
                    return cleanNewLap
                }
                return undefined
            }).filter(item => item !== undefined) as AddableLap[]

            if (lapsToEdit.length > 0) {
                editLaps(lapsToEdit)
            }

            if (lapsToAdd.length > 0) {
                addLaps(cleanedLapsToAdd)
            }

            if (lapsToDelete.length > 0) {
                const lapIds = lapsToDelete.map(lap => lap.id)
                deleteLaps(lapIds)
            }
        }

        setLoading(false)

        router.back()
    }

    const getLapsCount = () => {
        const totalText = `${lapsCount} lap${lapsCount !== 1 ? 's' : ''} total`

        const totalDeletedLaps = laps.filter(lap => lap.status === 'deleted').length
        const deletedText = (totalDeletedLaps > 0) ? `(${totalDeletedLaps} to be deleted)` : ''

        const finalString = `${totalText} ${deletedText}`

        return finalString
    }

    let routeCode, routeName
    if (travel) {
        routeCode = completeRoutes.find(route => route.id === travel.route_id)?.code || ''
        routeName = completeRoutes.find(route => route.id === travel.route_id)?.name || ''
    }

    return (
        <CollapsibleHeaderPage
            headerText='Edit Travel'
        >
            {(!travel || !laps) ? (
                null
            ) : (
                <>
                    <Input.Container style={{ paddingBottom: 0 }}>
                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButton.Block
                                label='Vehicle Initial Arrival'
                                condition={travel.bus_initial_arrival}
                                value={formatDateForDisplay(travel.bus_initial_arrival)}
                                onPress={() => openDatetimeModal('bus_initial_arrival')}
                            />

                            <ModalButton.Block
                                label='Vehicle Initial Departure'
                                condition={travel.bus_initial_departure}
                                value={formatDateForDisplay(travel.bus_initial_departure)}
                                onPress={() => openDatetimeModal('bus_initial_departure')}
                            />

                            <ModalButton.Block
                                label='Vehicle Final Arrival'
                                condition={travel.bus_final_arrival}
                                value={formatDateForDisplay(travel.bus_final_arrival)}
                                onPress={() => openDatetimeModal('bus_final_arrival')}
                            />
                        </View>

                        <Divider />

                        {showDatetimeModal && datetimeField && (
                            datetimeField === 'bus_initial_arrival' ||
                            datetimeField === 'bus_initial_departure' ||
                            datetimeField === 'bus_final_arrival'
                        ) && (
                                <CustomDateTimePicker
                                    label={datetimeFieldToCapitals(datetimeField)}
                                    visible={showDatetimeModal}
                                    initialDateTime={
                                        travel && travel[datetimeField]
                                            ? new Date(travel[datetimeField] as string)
                                            : new Date()
                                    }
                                    onClose={closeDatetimeModal}
                                    onConfirm={handleCustomDateConfirm}
                                />
                            )
                        }

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButton.Block
                                label='Route'
                                condition={travel.route_id}
                                value={(travel.route_id && routeName) ? `${routeCode} | ${routeName}` : 'Loading route...'}
                                onPress={() => openRouteModal()}
                                required
                            />

                            <TextInputBlock
                                editable={false}
                                label='Type'
                                placeholder='Vehicle type (auto-filled)'
                                value={completeVehicleTypes.find(type => type.id === travel.vehicle_type_id)?.name}
                            />

                            <TextInputBlock
                                label='Vehicle Code'
                                placeholder='Enter vehicle code'
                                value={travel.vehicle_code}
                                onChangeText={(text) => setTravel({ ...travel, vehicle_code: text })}
                                onClear={() => setTravel({ ...travel, vehicle_code: '' })}
                            />
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButton.Block
                                label='Direction'
                                condition={travel.direction_id}
                                value={directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                                onPress={() => openDirectionModal()}
                                required
                            />

                            <ModalButton.Block
                                label='First Stop'
                                condition={travel.first_stop_id}
                                value={completeStops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}
                                onPress={() => openStopModal('first_stop_id')}
                                required
                            />

                            <ModalButton.Block
                                label='Last Stop'
                                condition={travel.last_stop_id}
                                value={completeStops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}
                                onPress={() => openStopModal('last_stop_id')}
                                required
                            />

                            {(travel.first_stop_id || travel.last_stop_id) && (
                                <Button.Dismiss onPress={() => {
                                    const first_id = travel.first_stop_id

                                    setTravel({ ...travel, first_stop_id: travel.last_stop_id, last_stop_id: first_id })
                                }}>Switch Stop</Button.Dismiss>
                            )}
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <TextInputBlock.Multiline
                                label='Notes'
                                value={travel.notes}
                                placeholder='Notes (optional)'
                                onChangeText={(text) => setTravel({ ...travel, notes: text })}
                                onClear={() => setTravel({ ...travel, notes: '' })}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButton.Block
                                label='Laps'
                                condition={lapsCount > 0}
                                value={getLapsCount()}
                                onPress={() => openLapsModal()}
                            />
                        </View>

                        <Divider />

                        <Button.Row>
                            <NetButton label='Save Travel Edit(s)' onPress={handleOnSubmit} />
                        </Button.Row>
                    </Input.Container>

                    <EditTravelLapsModal
                        travel_id={travel.id}
                        currentLaps={laps ? laps : []}
                        stops={completeStops}
                        isModalVisible={showLapsModal}
                        onSelect={handleLapsSelect}
                        onClose={closeLapsModal}
                    />

                    <EditTravelDirectionModal
                        directions={directions}
                        isModalVisible={showDirectionModal}
                        searchQuery={directionSearchQuery}
                        setSearchQuery={setDirectionSearchQuery}
                        onSelect={handleDirectionSelect}
                        onClose={closeDirectionModal}
                    />

                    <EditTravelRouteModal
                        routes={completeRoutes}
                        isModalVisible={showRouteModal}
                        searchQuery={routeSearchQuery}
                        setSearchQuery={setRouteSearchQuery}
                        onSelect={handleRouteSelect}
                        onClose={closeRouteModal}
                    />

                    <EditTravelStopModal
                        stops={completeStops}
                        isModalVisible={showStopModal}
                        searchQuery={stopSearchQuery}
                        vehicleTypeId={travel.vehicle_type_id}
                        setSearchQuery={setStopSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeStopModal}
                    />
                </>
            )}
        </CollapsibleHeaderPage>
    )
}