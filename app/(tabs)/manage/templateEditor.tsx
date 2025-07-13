import Button from "@/components/button/BaseButton"
import DataButtonBase from "@/components/button/DatalistButton"
import Container from "@/components/Container"
import CustomIcon from "@/components/CustomIcon"
import Divider from "@/components/Divider"
import Input from "@/components/input/Input"
import LoadingScreen from "@/components/LoadingScreen"
import AddRideTemplate from "@/components/modal/templates/AddRideTemplate"
import EditRideTemplate from "@/components/modal/templates/EditRideTemplate"
import { useTemplateContext } from "@/context/TemplateContext"
import { useTheme } from "@/context/ThemeContext"
import useRideTemplates from "@/hooks/data/templates/useRideTemplates"
import useTripTemplates from "@/hooks/data/templates/useTripTemplates"
import useRoutes from "@/hooks/data/useRoutes"
import useStops from "@/hooks/data/useStops"
import useModalHandler from "@/hooks/useModalHandler"
import useTravelDetail from "@/hooks/useTravelDetail"
import { RideTemplate } from "@/src/types/data/RideTemplates"
import { TripTemplate } from "@/src/types/data/TripTemplates"
import { getDiffArrays } from "@/src/utils/dataUtils"
import { getDiffString } from "@/src/utils/dateUtils"
import { router } from "expo-router"
import moment from "moment-timezone"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

export default function TemplateEditor() {
    const { getTheme } = useTheme()
    const theme = getTheme()
    const {
        tripTemplateId,
        rideTemplateId, setRideTemplateId
    } = useTemplateContext()

    const { getDurationEstimate } = useTravelDetail()

    const { getTripTemplateById } = useTripTemplates()
    const { getRideTemplatesByTripTemplateId, modifyRideTemplates } = useRideTemplates()

    const { completeRoutes } = useRoutes()
    const { completeStops } = useStops()

    const {
        showModal: showRideTemplateModal,
        openModalWithSearch: openRideTemplateModal,
        closeModal: closeRideTemplateModal
    } = useModalHandler()

    const {
        showModal: showEditRideTemplateModal,
        openModalWithSearch: openEditRideTemplate,
        closeModal: closeEditRideTemplate
    } = useModalHandler()

    const [tripTemplate, setTripTemplate] = useState<TripTemplate | undefined>(undefined)
    const [rides, setRides] = useState<RideTemplate[]>([])
    const [originalRides, setOriginalRides] = useState<RideTemplate[]>([])

    useEffect(() => {
        if (tripTemplateId) {
            const tripTemplate = getTripTemplateById(tripTemplateId)
            setTripTemplate(tripTemplate)

            if (tripTemplate) {
                const rides = getRideTemplatesByTripTemplateId(tripTemplate.id)

                if (rides) {
                    const sortedRides = rides?.sort(function (a, b) { return a.sequence_order - b.sequence_order })
                    if (typeof rides !== 'undefined') {
                        setRides(sortedRides)
                        setOriginalRides(sortedRides)
                    }
                }
            }
        }
    }, [])

    const handleAddRide = (ride: RideTemplate) => {
        if (typeof tripTemplateId !== 'undefined') {
            const newRide = { ...ride, trip_template_id: tripTemplateId }
            rides.push(newRide)
        }

        closeRideTemplateModal()
    }

    const handleEditRide = (ride: RideTemplate) => {
        const updatedRides = rides.map(item => {
            if (item.sequence_order === ride.sequence_order) {
                return ride
            }
            return item
        })

        setRides(updatedRides)
        closeEditRideTemplate()
    }

    const handleDeleteRide = (sequenceOrder: number) => {
        const newArr = [...rides]
        newArr.splice(sequenceOrder - 1, 1)

        setRides(newArr)
    }

    const handleEditRideTemplate = (id: number) => {
        setRideTemplateId(id)
        openEditRideTemplate()
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

        const newArr = [...rides]

        const elementToMove = newArr[originalIndex]
        newArr[originalIndex] = newArr[newIndex]
        newArr[newIndex] = elementToMove

        setRides(newArr)
    }

    const renderItem = (item: RideTemplate, index: number) => {
        const selectedRoute = completeRoutes.find(route => route.id === item.route_id)
        const selectedFirstStop = completeStops.find(stop => stop.id === item.first_stop_id)
        const selectedLastStop = completeStops.find(stop => stop.id === item.last_stop_id)

        const estimate = getDurationEstimate(item.route_id, item.first_stop_id, item.last_stop_id)
        const averageDuration = getDiffString(moment.duration(estimate.avg_ride_duration, "seconds"))

        item = { ...item, sequence_order: index + 1 }

        return (
            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Input.Title>{item.sequence_order}</Input.Title>
                <DataButtonBase style={{ justifyContent: 'center' }} onPress={() => handleEditRideTemplate(item.id)}>
                    <View style={{ alignItems: 'center' }}>
                        <Input.Subtitle>{selectedRoute?.name}</Input.Subtitle>
                        <Divider />
                        <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Input.ValuePrimary>{selectedFirstStop?.name}</Input.ValuePrimary>
                            <CustomIcon name="chevron-down" size={15} />
                            <Input.ValuePrimary>{selectedLastStop?.name}</Input.ValuePrimary>
                        </View>
                        <Divider />
                        <Input.Text style={{ textAlign: 'center' }}>Average Duration: {averageDuration}</Input.Text>
                    </View>
                </DataButtonBase>
                <View style={{ gap: 10 }}>
                    {index !== 0 && <Button.Dismiss onPress={() => moveElement(index, 'before')}>▲</Button.Dismiss>}
                    <Button.Dismiss onPress={() => handleDeleteRide(item.sequence_order)}>
                        <CustomIcon name="trash-can" />
                    </Button.Dismiss>
                    {(index + 1) !== rides.length && <Button.Dismiss onPress={() => moveElement(index, 'next')}>▼</Button.Dismiss>}
                </View>
            </View >
        )
    }

    const handleTemplateSave = () => {
        const updatedRides = rides.map((ride, index) => ({ ...ride, 'sequence_order': index + 1 }))
        const diff = getDiffArrays(originalRides, updatedRides)

        modifyRideTemplates(diff.added, diff.updated, diff.deleted)

        router.back()
    }

    return (
        <Container>
            {!tripTemplate ? (
                <LoadingScreen />
            ) : (
                <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Input.Header>{tripTemplate.name}</Input.Header>
                            <Input.ValueText style={{ textAlign: 'justify' }}>{tripTemplate.description || ''}</Input.ValueText>
                        </View>

                        <Divider paddingSize={10} />

                        {rides.length === 0 ? (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Input.Title>No ride templates available to display</Input.Title>
                            </View>
                        ) : (
                            <FlatList
                                data={rides}
                                renderItem={({ item, index }) => renderItem(item, index)}
                                contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
                            />
                        )}
                    </View>

                    <View>
                        <Button.Row>
                            <Button.Add onPress={() => openRideTemplateModal()}>Add Ride</Button.Add>
                        </Button.Row>

                        <Divider paddingSize={10} />

                        <Button.Row>
                            <Button.Add onPress={handleTemplateSave}>Save Changes</Button.Add>
                        </Button.Row>
                    </View>
                </SafeAreaView>
            )}

            <AddRideTemplate
                isModalVisible={showRideTemplateModal}
                onSubmit={handleAddRide}
                onClose={closeRideTemplateModal}
            />

            {rideTemplateId && (
                <EditRideTemplate
                    isModalVisible={showEditRideTemplateModal}
                    onSubmit={handleEditRide}
                    onClose={closeEditRideTemplate}
                    rideTemplateId={rideTemplateId}
                />
            )}
        </Container>
    )
}