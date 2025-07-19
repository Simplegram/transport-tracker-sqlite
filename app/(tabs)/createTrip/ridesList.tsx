import Button from "@/components/button/BaseButton"
import DataButtonBase from "@/components/button/DatalistButton"
import { ModalButton } from "@/components/button/ModalButton"
import Container from "@/components/Container"
import CustomIcon from "@/components/CustomIcon"
import Divider from "@/components/Divider"
import Input from "@/components/input/Input"
import LoadingScreen from "@/components/LoadingScreen"
import CustomDateTimePicker from "@/components/modal/CustomDatetimePicker"
import { EmptyHeaderComponent } from "@/components/ride/RidesFlatlist"
import { useTheme } from "@/context/ThemeContext"
import { useTripContext } from "@/context/TripContext"
import useRides from "@/hooks/data/useRides"
import useTrips from "@/hooks/data/useTrips"
import useModalHandler from "@/hooks/useModalHandler"
import useTravelDetail from "@/hooks/useTravelDetail"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { CompleteRide, CompleteTrip } from "@/src/types/CompleteTypes"
import { Trip } from "@/src/types/Types"
import { formatDateForDisplay, getDiffString } from "@/src/utils/dateUtils"
import { datetimeFieldToCapitals } from "@/src/utils/utils"
import { router } from "expo-router"
import moment from "moment-timezone"
import { useEffect, useState } from "react"
import { SafeAreaView, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"

export default function RidesList() {
    const { theme } = useTheme()

    const { tripId, setCurrentTrip } = useTripContext()

    const { getTripById, editTrip } = useTrips()
    const { getCompleteRidesByTripId } = useRides()
    const { getDurationEstimate } = useTravelDetail()

    const [trip, setTrip] = useState<Trip | CompleteTrip>()
    const [tripRides, setTripRides] = useState<CompleteRide[]>([])

    useEffect(() => {
        if (tripId) {
            const trip = getTripById(tripId, true)
            if (trip && trip.length > 0) {
                setTrip(trip[0])

                if (trip[0].template_id) {
                    const rides = getCompleteRidesByTripId(tripId)
                    if (rides) {
                        setTripRides(rides)
                    }
                }
            }
        }
    }, [tripId])

    const {
        showModal: showDatetimeModal,
        editingField: datetimeField,
        openModalWithSearch: openDatetimeModal,
        closeModal: closeDatetimeModal
    } = useModalHandler()

    const handleCustomDateConfirm = (selectedDate: Date) => {
        if (datetimeField) {
            setTrip(prev => {
                const updatedTrip = {
                    ...(prev || {}),
                    [datetimeField]: selectedDate.toISOString()
                }
                return updatedTrip as Trip | CompleteTrip
            })
        }
        closeDatetimeModal()
    }

    const moveElement = (originalIndex: number, direction: 'before' | 'next') => {
        let newIndex
        if (direction === 'before') {
            newIndex = originalIndex - 1
        } else if (direction === 'next') {
            newIndex = originalIndex + 1
        } else {
            console.warn("Invalid direction. Use 'before' or 'next'.")
            return
        }

        const newArr = [...tripRides]

        const elementToMove = newArr[originalIndex]
        newArr[originalIndex] = newArr[newIndex]
        newArr[newIndex] = elementToMove

        setTripRides(newArr)
    }

    const renderItem = (item: CompleteRide, index: number) => {
        const estimate = getDurationEstimate(item.route.id, item.first_stop.id, item.last_stop.id)
        const averageDuration = getDiffString(moment.duration(estimate.avg_ride_duration, "seconds"))

        item = { ...item, sequence_order: index + 1 }

        return (
            <View style={{ flex: 1, gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Input.Title>{item.sequence_order}</Input.Title>
                <DataButtonBase style={{ justifyContent: 'center' }} onPress={() => console.log('edit')}>
                    <View style={{ alignItems: 'center' }}>
                        <Input.Subtitle>{item.route.name}</Input.Subtitle>
                        <Divider />
                        <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Input.ValuePrimary>{item.first_stop.name}</Input.ValuePrimary>
                            <CustomIcon name="chevron-down" size={15} />
                            <Input.ValuePrimary>{item.last_stop.name}</Input.ValuePrimary>
                        </View>
                        <Divider />
                        <Input.Text style={{ textAlign: 'center' }}>Average Duration: {averageDuration}</Input.Text>
                    </View>
                </DataButtonBase>
                <View style={{ gap: 10 }}>
                    {index !== 0 && <Button.Dismiss onPress={() => moveElement(index, 'before')}>▲</Button.Dismiss>}
                    <Button.Dismiss onPress={() => console.log('delete')}>
                        <CustomIcon name="trash-can" />
                    </Button.Dismiss>
                    {(index + 1) !== tripRides.length && <Button.Dismiss onPress={() => moveElement(index, 'next')}>▼</Button.Dismiss>}
                </View>
            </View >
        )
    }

    const handleSaveTrip = () => {
        if (trip) editTrip(trip)
        router.push('/(tabs)/createTrip')
        router.push('/(tabs)/main')
    }

    const handleViewTripDetail = () => {
        if (trip) setCurrentTrip(trip)
        router.push("/main/tripDetail")
    }

    return (
        <Container>
            {!trip ? (
                <LoadingScreen />
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <View>
                        <Input.Header>{trip.name}</Input.Header>
                        <Input.ValueText style={{ textAlign: 'justify' }}>{trip.description || ''}</Input.ValueText>
                    </View>

                    <Divider paddingSize={10} />

                    {tripRides.length === 0 ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Input.Title>No rides available to display</Input.Title>
                        </View>
                    ) : (
                        <FlatList
                            data={tripRides}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={{
                                gap: 8,
                                flexGrow: 1,
                            }}
                            keyboardShouldPersistTaps={'always'}
                            ListHeaderComponent={() => <EmptyHeaderComponent minScale={0.15} />}
                            ListHeaderComponentStyle={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <Divider paddingSize={10} />

                    <View style={inputElementStyles[theme].inputLargeGroup}>
                        <ModalButton.Block
                            label='Trip Start Time'
                            condition={trip.started_at}
                            value={formatDateForDisplay(trip.started_at)}
                            onPress={() => openDatetimeModal('started_at')}
                        />

                        <ModalButton.Block
                            label='Trip Complete Time'
                            condition={trip.completed_at}
                            value={formatDateForDisplay(trip.completed_at)}
                            onPress={() => openDatetimeModal('completed_at')}
                        />
                    </View>

                    {showDatetimeModal && datetimeField && (
                        datetimeField === 'started_at' ||
                        datetimeField === 'completed_at'
                    ) && (
                            <CustomDateTimePicker
                                label={datetimeFieldToCapitals(datetimeField)}
                                visible={showDatetimeModal}
                                initialDateTime={
                                    trip && trip[datetimeField]
                                        ? new Date(trip[datetimeField] as string)
                                        : new Date()
                                }
                                onClose={closeDatetimeModal}
                                onConfirm={handleCustomDateConfirm}
                            />
                        )
                    }

                    <Divider paddingSize={10} />

                    <Button.Row>
                        <Button.Add onPress={handleViewTripDetail}>Trip Detail</Button.Add>
                        <Button.Add onPress={handleSaveTrip}>Save Trip</Button.Add>
                    </Button.Row>
                </SafeAreaView>
            )}
        </Container>
    )
}