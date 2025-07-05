import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import Divider from '@/components/Divider'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import MapDisplay from '@/components/MapDisplay'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import ModalTemplate from '@/components/ModalTemplate'
import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { EditableLapModalProp } from '@/src/types/EditableTypes'
import { getDateToIsoString } from '@/src/utils/dateUtils'
import { formatDateForDisplay } from '@/src/utils/utils'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ManageableLap } from '../FlatlistPicker'
import EditRideStopModal from '../rideModal/EditRideStopModal'

export default function EditLapModal({ stops, selectedLap, isModalVisible, onClose, onSelect }: EditableLapModalProp) {
    const { dialog } = useDialog()
    const { theme } = useTheme()

    const {
        showModal,
        searchQuery,
        setSearchQuery,
        openModal,
        closeModal
    } = useModalHandler()

    const [lap, setLap] = useState<ManageableLap>()

    const [showDatetimePicker, setShowDatetimePicker] = useState(false)

    useEffect(() => {
        setLap(selectedLap)
    }, [selectedLap])

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = getDateToIsoString(selectedDate)

        if (!lap) {
            dialog(
                "Unexpected Error",
                `Lap is null which is not supposed to happen. Try again.\nSelected date is ${isoSelectedDate}`
            )
            return
        }

        if (!lap.time) {
            dialog('Input Required', 'Please select time')
            return
        }

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    }

    const handleStopSelect = (stopId: number) => {
        if (!lap) {
            dialog(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        setLap({ ...lap, stop_id: stopId })
        closeModal()
    }

    const handleOnSubmit = () => {
        if (!lap) {
            dialog(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        onSelect(lap)
    }

    return (
        <ModalTemplate.Bottom visible={isModalVisible}>
            {!lap ? (
                <LoadingScreen></LoadingScreen>
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
                            onPress={openModal}
                        />

                        <View style={[inputElementStyles[theme].inputGroup, { height: 160 }]}>
                            <MapDisplay.Pin
                                zoomLevel={15}
                                centerCoordinate={[lap.lon || 0, lap.lat || 0]}
                                zoomEnabled={false}
                                scrollEnabled={false}
                            />
                        </View>

                        <TextInputBlock.Multiline
                            label='Note'
                            value={lap.note}
                            placeholder='Notes (optional)'
                            onChangeText={(text) => setLap({ ...lap, note: text })}
                            onClear={() => setLap({ ...lap, note: '' })}
                        />

                        <Divider />

                        <Button.Row>
                            <Button.Dismiss label='Cancel' onPress={onClose} />
                            <Button.Add label='Edit Lap' onPress={handleOnSubmit} />
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