import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import Input from '@/components/input/Input'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { useTheme } from '@/context/ThemeContext'
import useTravels from '@/hooks/data/useTravels'
import useExportImport from '@/hooks/useExportImport'
import useModalHandler from '@/hooks/useModalHandler'
import { AddableTravel } from '@/src/types/AddableTravels'
import { datetimeFieldToCapitals, formatDateForDisplay } from '@/src/utils/utils'
import * as DocumentPicker from 'expo-document-picker'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

export default function Import() {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { importData } = useExportImport()

    const { travels, getTravels, deleteAllTravels, getTravelsByTimeBetween } = useTravels()

    const [travel, setTravel] = useState<AddableTravel | null>(null)

    const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset>()
    const [text, setText] = useState<string>('hello')

    useEffect(() => {
        setTravel(travels[0])
    }, [travels])

    const {
        showModal: showDatetimeModal,
        editingField: datetimeField,
        openModalWithSearch: openDatetimeModal,
        closeModal: closeDatetimeModal
    } = useModalHandler()

    const handleCustomDateConfirm = (selectedDate: Date) => {
        if (datetimeField) {
            setTravel(prev => prev ? ({ ...prev, [datetimeField]: selectedDate }) : null)
        }
        closeDatetimeModal()
    }

    // const start_time = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString()
    // const end_time = moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toISOString()
    // console.log(getTravelsByTimeBetween(start_time, end_time))

    // console.log(travel?.bus_initial_arrival)

    // if (travels.length > 0) console.log(utcToLocaltime(travels[0].created_at))

    return (
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.palette.background }}>
            <Input.Header style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>Import your JSON data</Input.Header>
            <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>Import your JSON data</Input.ValueText>
            <View style={{ gap: 10 }}>
                <Button.Cancel onPress={deleteAllTravels}>Delete Travels</Button.Cancel>
                <Button.Add onPress={getTravels}>Get Travels</Button.Add>
            </View>

            {
                showDatetimeModal && datetimeField && (
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

            {travel && travel.bus_initial_arrival && (
                <ModalButton.Block
                    label='Vehicle Initial Arrival'
                    condition={travel.bus_initial_arrival}
                    value={formatDateForDisplay(travel.bus_initial_arrival)}
                    onPress={() => openDatetimeModal('bus_initial_arrival')}
                />
            )}
        </View>
    )
}