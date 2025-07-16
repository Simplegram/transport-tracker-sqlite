import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import NetButton from '@/components/button/ValidNetButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import AddRideLapsModal from '@/components/modal/rideModal/AddRideLapsModal'
import EditRideDirectionModal from '@/components/modal/rideModal/EditRideDirectionModal'
import EditRideRouteModal from '@/components/modal/rideModal/EditRideRouteModal'
import EditRideStopModal from '@/components/modal/rideModal/EditRideStopModal'
import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import useDataOperations from '@/hooks/data/useDataOperations'
import useDirections from '@/hooks/data/useDirections'
import useRides from '@/hooks/data/useRides'
import useRoutes from '@/hooks/data/useRoutes'
import useStops from '@/hooks/data/useStops'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import { useToggleLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap, AddableRide } from '@/src/types/AddableTypes'
import { formatDateForDisplay } from '@/src/utils/dateUtils'
import { datetimeFieldToCapitals } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    View
} from 'react-native'

export default function AddRide() {
    const { theme } = useTheme()
    const { dialog } = useDialog()

    const { directions, getDirections } = useDirections()
    const { completeStops, getCompleteStops } = useStops()
    const { completeRoutes, getCompleteRoutes } = useRoutes()
    const { completeVehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()

    const { insertRide } = useRides()

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

    const [ride, setRide] = useState<AddableRide | null>(null)

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

    const setDefaultRide = () => {
        setRide({
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
        setDefaultRide()
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
            setRide(prev => prev ? ({ ...prev, [datetimeField]: selectedDate.toISOString() }) : null)
        }
        closeDatetimeModal()
    }

    if (!ride) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && ride) {
            setRide(prev => prev ? ({
                ...prev,
                [stopEditingField]: stopId
            }) : null)
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (ride) {
            setRide(prev => prev ? ({
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
        if (ride) {
            setRide({ ...ride, direction_id: directionId })
        }

        closeDirectionModal()
    }

    const handleLapsSelect = (laps: AddableLap[]) => {
        if (laps) setLaps(laps)

        closeLapsModal()
    }

    const handleOnSubmit = async () => {
        if (
            !ride.direction_id ||
            !ride.first_stop_id ||
            !ride.last_stop_id ||
            !ride.route_id ||
            !ride.vehicle_type_id
        ) {
            dialog('Input Required', 'Please choose route/direction/stops')
            return
        }

        setLoading(true)

        const addedRide = insertRide(ride)
        if (addedRide && addedRide.insertId) {
            addLaps(addedRide.insertId, laps)
            setDefaultRide()
        }

        setLoading(false)

        router.push('/(tabs)/main')
    }

    return (
        <CollapsibleHeaderPage
            headerText='Add New Ride'
        >
            {loading && (
                <LoadingScreen></LoadingScreen>
            )}
            <Input.Container style={{ paddingBottom: 0 }}>
                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Vehicle Initial Arrival'
                        condition={ride.bus_initial_arrival}
                        value={formatDateForDisplay(ride.bus_initial_arrival)}
                        onPress={() => openDatetimeModal('bus_initial_arrival')}
                    />

                    <ModalButton.Block
                        label='Vehicle Initial Departure'
                        condition={ride.bus_initial_departure}
                        value={formatDateForDisplay(ride.bus_initial_departure)}
                        onPress={() => openDatetimeModal('bus_initial_departure')}
                    />

                    <ModalButton.Block
                        label='Vehicle Final Arrival'
                        condition={ride.bus_final_arrival}
                        value={formatDateForDisplay(ride.bus_final_arrival)}
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
                                ride && ride[datetimeField]
                                    ? new Date(ride[datetimeField] as string)
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
                        condition={ride.route_id}
                        value={ride.route_id ? `${completeRoutes.find(route => route.id === ride.route_id)?.code || ''} | ${completeRoutes.find(route => route.id === ride.route_id)?.name || ''}` : 'Select Route...'}
                        onPress={() => openRouteModal()}
                        required
                    />

                    <TextInputBlock
                        editable={false}
                        label='Type'
                        placeholder='Vehicle type (auto-filled)'
                        value={completeVehicleTypes.find(type => type.id === ride.vehicle_type_id)?.name}
                    />

                    <TextInputBlock
                        label='Vehicle Code'
                        placeholder='Enter vehicle code'
                        value={ride.vehicle_code || undefined}
                        onChangeText={(text) => setRide({ ...ride, vehicle_code: text })}
                        onClear={() => setRide({ ...ride, vehicle_code: '' })}
                    />
                </View>

                <Divider />

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Direction'
                        condition={ride.direction_id}
                        value={directions.find(direction => direction.id === ride.direction_id)?.name || 'Select Direction...'}
                        onPress={() => openDirectionModal()}
                        required
                    />

                    <ModalButton.Block
                        label='First Stop'
                        condition={ride.first_stop_id}
                        value={completeStops.find(stop => stop.id === ride.first_stop_id)?.name || 'Select First Stop...'}
                        onPress={() => openStopModal('first_stop_id')}
                        required
                    />

                    <ModalButton.Block
                        label='Last Stop'
                        condition={ride.last_stop_id}
                        value={completeStops.find(stop => stop.id === ride.last_stop_id)?.name || 'Select Last Stop...'}
                        onPress={() => openStopModal('last_stop_id')}
                        required
                    />
                    {(ride.first_stop_id || ride.last_stop_id) && (
                        <Button.Dismiss onPress={() => {
                            const first_id = ride.first_stop_id

                            setRide({ ...ride, first_stop_id: ride.last_stop_id, last_stop_id: first_id })
                        }}>Switch Stop</Button.Dismiss>
                    )}
                </View>

                <Divider />

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <TextInputBlock.Multiline
                        label='Notes'
                        value={ride.notes || undefined}
                        placeholder='Notes (optional)'
                        onChangeText={(text) => setRide({ ...ride, notes: text })}
                        onClear={() => setRide({ ...ride, notes: '' })}
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
                    <NetButton label='Add Ride' onPress={handleOnSubmit} />
                </Button.Row>
            </Input.Container>

            <AddRideLapsModal
                stops={completeStops}
                currentLaps={laps}
                isModalVisible={showLapsModal}
                onSelect={handleLapsSelect}
                onClose={closeLapsModal}
            />

            <EditRideDirectionModal
                directions={directions}
                isModalVisible={showDirectionModal}
                searchQuery={directionSearchQuery}
                setSearchQuery={setDirectionSearchQuery}
                onSelect={handleDirectionSelect}
                onClose={closeDirectionModal}
            />

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
                vehicleTypeId={ride.vehicle_type_id}
                setSearchQuery={setStopSearchQuery}
                onSelect={handleStopSelect}
                onClose={closeStopModal}
            />
        </CollapsibleHeaderPage>
    )
}