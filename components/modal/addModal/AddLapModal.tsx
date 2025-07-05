import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import MapDisplay from '@/components/MapDisplay'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import ModalTemplate from '@/components/ModalTemplate'
import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import useLocation from '@/hooks/useLocation'
import useModalHandler from '@/hooks/useModalHandler'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap, AddableLapModalProp } from '@/src/types/AddableTravels'
import { getDateToIsoString } from '@/src/utils/dateUtils'
import { formatDateForDisplay, formatLapTimeDisplay } from '@/src/utils/utils'
import { UserLocation } from '@maplibre/maplibre-react-native'
import * as Crypto from 'expo-crypto'
import { useFocusEffect } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
    View
} from 'react-native'
import EditRideStopModal from '../rideModal/EditRideStopModal'

export default function AddLapModal({ stops, isModalVisible, onClose, onSelect }: AddableLapModalProp) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const {
        showModal,
        searchQuery,
        setSearchQuery,
        openModal,
        closeModal
    } = useModalHandler()

    const { location, refetchLocation, isLoadingLocation } = useLocation()

    const mapRef = useRef(null)

    const [lap, setLap] = useState<AddableLap>({ id: '', time: undefined, lat: null, lon: null, stop_id: null, note: null })

    const [showDatetimePicker, setShowDatetimePicker] = useState(false)

    const [centerCoordinate, setCenterCoordinate] = useState<number[]>([0, 0])

    useFocusEffect(
        React.useCallback(() => {
            if (!lap.stop_id) {
                let lon: number = 0
                let lat: number = 0
                if (location) {
                    lon = location.coords.longitude
                    lat = location.coords.latitude
                }

                const currentTime = new Date().toISOString()
                const formattedTime = formatLapTimeDisplay(currentTime)

                setLap({ ...lap, time: formattedTime, lon: lon, lat: lat })
                setCenterCoordinate([lon, lat])
            }
        }, [location])
    )

    useFocusEffect(
        React.useCallback(() => {
            refetchLocation()

            const currentTime = new Date().toISOString()
            const formattedTime = formatLapTimeDisplay(currentTime)

            setLap({ ...lap, id: Crypto.randomUUID(), time: formattedTime, lon: null, lat: null, stop_id: null, note: null })

            return () => {
                setLap({ ...lap, id: Crypto.randomUUID(), time: formattedTime, lon: null, lat: null, stop_id: null, note: null })
            }
        }, [isModalVisible])
    )

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = getDateToIsoString(selectedDate)

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    }

    const handleStopSelect = (stopId: number) => {
        setLap({ ...lap, stop_id: stopId })

        const stop = stops.find(stop => stop.id === stopId)
        if (stop && stop.lat && stop.lon) {
            setLap({ ...lap, lon: stop.lon, lat: stop.lat, stop_id: stopId })
            setCenterCoordinate([stop.lon, stop.lat])
        }

        closeModal()
    }

    const handleOnSubmit = () => {
        if (!lap.time) {
            dialog('Input Required', 'Please select time')
            return
        }

        onSelect(lap)
    }

    return (
        <ModalTemplate.Bottom visible={isModalVisible}>
            {!stops ? (
                <Input.LoadingLabel />
            ) : (
                <>
                    <ModalTemplate.BottomContainer style={{ maxHeight: 600 }}>
                        <ModalButton.Block
                            label='Time'
                            condition={lap.time}
                            value={formatDateForDisplay(lap.time)}
                            onPress={() => setShowDatetimePicker(true)}
                            required
                        />

                        <ModalButton.Block
                            label='Stop'
                            condition={lap.stop_id}
                            value={stops.find(item => item.id === lap.stop_id)?.name || 'Select Stop'}
                            onPress={() => openModal()}
                            onClear={() => setLap({ ...lap, stop_id: null })}
                        />

                        <View style={[inputElementStyles[theme].inputGroup, { height: 160 }]}>
                            <MapDisplay.Pin
                                mapRef={mapRef}
                                zoomLevel={15}
                                centerCoordinate={centerCoordinate}
                                zoomEnabled={false}
                                scrollEnabled={false}
                                locationLoading={isLoadingLocation}
                                updateLocation={lap.stop_id ? undefined : (() => refetchLocation())}
                            >
                                <UserLocation visible={true} />
                            </MapDisplay.Pin>
                        </View>

                        <TextInputBlock.Multiline
                            label='Note'
                            value={lap.note || undefined}
                            placeholder='Notes (optional)'
                            onChangeText={(text) => setLap({ ...lap, note: text })}
                            onClear={() => setLap({ ...lap, note: '' })}
                        />

                        <Divider />

                        <Button.Row>
                            <Button.Dismiss label='Cancel' onPress={onClose} />
                            <Button.Add label='Add Lap' onPress={handleOnSubmit} />
                        </Button.Row>
                    </ModalTemplate.BottomContainer>

                    <EditRideStopModal
                        stops={stops}
                        isModalVisible={showModal}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeModal}
                    />

                    {showDatetimePicker && (
                        <CustomDateTimePicker
                            visible={showDatetimePicker}
                            initialDateTime={new Date()}
                            onClose={() => setShowDatetimePicker(false)}
                            onConfirm={handleCustomDateConfirm}
                        />
                    )}
                </>
            )}
        </ModalTemplate.Bottom>
    )
}