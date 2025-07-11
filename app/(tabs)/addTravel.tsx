import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import NetButton from '@/components/button/ValidNetButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import AddTravelLapsModal from '@/components/modal/travelModal/AddTravelLapsModal'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import useDataOperations from '@/hooks/data/useDataOperations'
import useDirections from '@/hooks/data/useDirections'
import useRoutes from '@/hooks/data/useRoutes'
import useStops from '@/hooks/data/useStops'
import useTravels from '@/hooks/data/useTravels'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import { useToggleLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap, AddableTravel } from '@/src/types/AddableTravels'
import { datetimeFieldToCapitals, formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    View
} from 'react-native'

export default function AddTravel() {
    const { theme } = useTheme()
    const { dialog } = useDialog()

    const { directions, getDirections } = useDirections()
    const { completeStops, getCompleteStops } = useStops()
    const { completeRoutes, getCompleteRoutes } = useRoutes()
    const { completeVehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()

    const { insertTravel } = useTravels()

    const { addLaps } = useDataOperations()

    const refetchTravelData = async () => {
        getDirections()

        getCompleteStops()
        getCompleteRoutes()
        getCompleteVehicleTypes()
    }

    const { loading, setLoading } = useToggleLoading()

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [lapsCount, setLapsCount] = useState<number>(0)

    const [travel, setTravel] = useState<AddableTravel | null>(null)

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

    const setDefaultTravel = () => {
        setTravel({
            created_at: moment().toISOString(),
            direction_id: undefined,
            first_stop_id: undefined,
            last_stop_id: undefined,
            route_id: undefined,
            vehicle_type_id: undefined,
            bus_final_arrival: null,
            bus_initial_arrival: null,
            bus_initial_departure: null,
            vehicle_code: null,
            notes: null,
        })
        setLaps([])
    }

    useEffect(() => {
        setDefaultTravel()
    }, [])

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

    const handleCustomDateConfirm = (selectedDate: Date) => {
        if (datetimeField) {
            setTravel(prev => prev ? ({ ...prev, [datetimeField]: selectedDate.toISOString() }) : null)
        }
        closeDatetimeModal()
    }

    if (!travel) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && travel) {
            setTravel(prev => prev ? ({
                ...prev,
                [stopEditingField]: stopId
            }) : null)
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => prev ? ({
                ...prev,
                route_id: routeId,
                vehicle_type_id: completeRoutes.find(route => route.id === routeId)?.vehicle_type.id,
                first_stop_id: completeRoutes.find(route => route.id === routeId)?.first_stop_id,
                last_stop_id: completeRoutes.find(route => route.id === routeId)?.last_stop_id,
            }) : null)
        }
        closeRouteModal()
    }

    const handleDirectionSelect = (directionId: number) => {
        if (travel) {
            setTravel({ ...travel, direction_id: directionId })
        }

        closeDirectionModal()
    }

    const handleLapsSelect = (laps: AddableLap[]) => {
        if (laps) setLaps(laps)

        closeLapsModal()
    }

    const handleOnSubmit = async () => {
        if (
            !travel.direction_id ||
            !travel.first_stop_id ||
            !travel.last_stop_id ||
            !travel.route_id ||
            !travel.vehicle_type_id
        ) {
            dialog('Input Required', 'Please choose route/direction/stops')
            return
        }

        setLoading(true)

        const addedTravel = insertTravel(travel)
        if (addedTravel && addedTravel.insertId) {
            addLaps(addedTravel.insertId, laps)
            setDefaultTravel()
        }

        setLoading(false)

        router.push('/(tabs)/main')
    }

    return (
        <CollapsibleHeaderPage
            headerText='Add New Travel'
        >
            {loading && (
                <LoadingScreen></LoadingScreen>
            )}
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
                        value={travel.route_id ? `${completeRoutes.find(route => route.id === travel.route_id)?.code || ''} | ${completeRoutes.find(route => route.id === travel.route_id)?.name || ''}` : 'Select Route...'}
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
                        value={travel.vehicle_code || undefined}
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
                        value={travel.notes || undefined}
                        placeholder='Notes (optional)'
                        onChangeText={(text) => setTravel({ ...travel, notes: text })}
                        onClear={() => setTravel({ ...travel, notes: '' })}
                    />
                </View>

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Laps'
                        condition={lapsCount > 0}
                        value={`${lapsCount} lap${lapsCount !== 1 ? 's' : ''} selected`}
                        onPress={() => openLapsModal()}
                    />
                </View>

                <Divider />

                <Button.Row>
                    <NetButton label='Add Travel' onPress={handleOnSubmit} />
                </Button.Row>
            </Input.Container>

            <AddTravelLapsModal
                stops={completeStops}
                currentLaps={laps}
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
        </CollapsibleHeaderPage>
    )
}