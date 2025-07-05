import Button from '@/components/button/BaseButton'
import Input from '@/components/input/Input'
import ModalTemplate from '@/components/ModalTemplate'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { modalStyles } from '@/src/styles/ModalStyles'
import { EditableLapsModalProp } from '@/src/types/EditableTravels'
import { sortLaps } from '@/src/utils/dataUtils'
import { LocationManager } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import AddLapModal from '../addModal/AddLapModal'
import EditLapModal from '../editModal/EditLapModal'
import FlatlistBase, { ManageableLap } from '../FlatlistPicker'

export default function EditTravelLapsModal({ stops, ride_id, currentLaps, isModalVisible, onClose, onSelect }: EditableLapsModalProp) {
    const { theme } = useTheme()

    const {
        showModal: showLapModal,
        openModal: openLapModal,
        closeModal: closeLapModal
    } = useModalHandler()

    const {
        showModal: showEditLapModal,
        openModal: openEditLapModal,
        closeModal: closeEditLapModal
    } = useModalHandler()

    const [laps, setLaps] = useState<ManageableLap[]>([])
    const [selectedLap, setSelectedLap] = useState<ManageableLap | undefined>(undefined)

    useFocusEffect(
        useCallback(() => {
            LocationManager.start()
    
            return () => {
                LocationManager.stop()
            }
        }, [])
    )

    const handleLapSelect = (lap: ManageableLap) => {
        setSelectedLap(lap)
        openEditLapModal()
    }

    const handleLapAdd = (lap: ManageableLap) => {
        if (laps) setLaps([lap, ...laps])

        closeLapModal()
    }

    const handleLapEdit = (lap: ManageableLap) => {
        const updatedLaps = laps.map(item => {
            if (item.id === lap.id) {
                return lap
            }
            return item
        })

        setLaps(updatedLaps)
        closeEditLapModal()
    }

    const handleLapRemove = (id: number | string) => {
        const newLaps = laps.map(lap => {
            if (lap.id === id) {
                return {
                    ...lap,
                    status: 'deleted'
                }
            } else {
                return lap
            }
        })
        setLaps(newLaps)
    }

    const handleOnSubmit = () => {
        onSelect(laps)
    }

    useEffect(() => {
        const sortedLaps = sortLaps(currentLaps)
        setLaps(sortedLaps)
    }, [currentLaps])

    useFocusEffect(
        React.useCallback(() => {
            setLaps(currentLaps)
        }, [isModalVisible])
    )

    return (
        <ModalTemplate.Bottom visible={isModalVisible}>
            <ModalTemplate.BottomContainer>
                <View style={modalStyles[theme].inputContainer}>
                    {laps.length === 0 ? (
                        <View style={styles[theme].emptyList}>
                            <Input.Label>No lap found</Input.Label>
                        </View>
                    ) : (
                        <FlatlistBase.LapList
                            laps={laps}
                            stops={stops}
                            onPress={handleLapSelect}
                            onRemove={handleLapRemove}
                        />
                    )}
                </View>

                <Button.Row>
                    <Button.Add label='Add lap' onPress={openLapModal} />
                </Button.Row>

                <Button.Row>
                    <Button.Dismiss label='Cancel' onPress={onClose} />
                    <Button.Add label='Save Laps' onPress={handleOnSubmit} />
                </Button.Row>
            </ModalTemplate.BottomContainer>

            {selectedLap && (
                <EditLapModal
                    stops={stops}
                    selectedLap={selectedLap}
                    isModalVisible={showEditLapModal}
                    onSelect={handleLapEdit}
                    onClose={closeEditLapModal}
                />
            )}

            <AddLapModal
                stops={stops}
                ride_id={ride_id}
                isModalVisible={showLapModal}
                onSelect={handleLapAdd}
                onClose={closeLapModal}
            />
        </ModalTemplate.Bottom>
    )
};

const lightStyles = StyleSheet.create({
    emptyList: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderRadius: 10,
    },
})

const styles = {
    light: lightStyles,
    dark: StyleSheet.create({
        emptyList: {
            ...lightStyles.emptyList,
        },
        detailRow: {
            ...lightStyles.detailRow,
            paddingHorizontal: 0,
        },
    })
}