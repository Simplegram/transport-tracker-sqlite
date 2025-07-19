import Button from "@/components/button/BaseButton"
import DataButtonBase from "@/components/button/DatalistButton"
import Container from "@/components/Container"
import Input from "@/components/input/Input"
import { EmptyHeaderComponent } from "@/components/ride/RidesFlatlist"
import { useDialog } from "@/context/DialogContext"
import useRideTemplates from "@/hooks/data/templates/useRideTemplates"
import useTripTemplates from "@/hooks/data/templates/useTripTemplates"
import useCreateTrip from "@/hooks/trips/useCreateTrip"
import useTravelDetail from "@/hooks/useTravelDetail"
import { TripTemplate } from "@/src/types/data/TripTemplates"
import { getDiffString } from "@/src/utils/dateUtils"
import { router, useFocusEffect } from "expo-router"
import moment from "moment-timezone"
import { useCallback } from "react"
import { View } from "react-native"
import { FlatList } from "react-native-gesture-handler"

export default function TripHome() {
    const { dialog, setShowDialog } = useDialog()
    const { tripTemplates, getTripTemplates } = useTripTemplates()

    const { createTripFromTemplate } = useCreateTrip()
    const { getRideTemplatesByTripTemplateId } = useRideTemplates()
    const { getDurationEstimate } = useTravelDetail()

    const useTripTemplate = (tripTemplateId: number, tripName: string) => {
        dialog("Trip creation confirmation", `${tripName}\n\nAre you sure to create trip from template?`,
            [
                { text: 'Cancel', type: 'dismiss', onPress: () => setShowDialog(false) },
                {
                    text: 'Confirm', type: 'add', onPress: () => {
                        setShowDialog(false)
                        createTripFromTemplate(tripTemplateId)
                        router.push('/(tabs)/createTrip/ridesList')
                    }
                }
            ]
        )
    }

    useFocusEffect(
        useCallback(() => {
            getTripTemplates()
        }, [])
    )

    const renderItem = (item: TripTemplate) => {
        const tripRides = getRideTemplatesByTripTemplateId(item.id)

        let rawAverageDuration: number = 0
        if (tripRides) {
            tripRides.map(ride => {
                const estimate = getDurationEstimate(ride.route_id, ride.first_stop_id, ride.last_stop_id)
                rawAverageDuration += estimate.avg_ride_duration
            })
        }
        const averageDuration = getDiffString(moment.duration(rawAverageDuration, "seconds"))

        return (
            <DataButtonBase.TripTemplateButton
                onPress={() => useTripTemplate(item.id, item.name)}
            >
                <Input.Subtitle>{item.name}</Input.Subtitle>
                <Input.ValueText>{item.description}</Input.ValueText>
                {rawAverageDuration > 0 && <Input.ValuePrimary>Estimate: {averageDuration}</Input.ValuePrimary>}
            </DataButtonBase.TripTemplateButton>
        )
    }

    const redirectToAddRide = () => {
        router.push('/(tabs)/createTrip/addRide')
    }

    const redirectToTripTemplate = () => {
        router.push('/(tabs)/manage/templatesList')
    }

    return (
        <Container style={{
            flex: 1
        }}>
            {tripTemplates.length === 0 ? (
                <View style={{
                    gap: 10,
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <Input.Title style={{ textAlign: 'center' }}>No trip templates available to display. Create a trip template to start.</Input.Title>
                    <Button.Row>
                        <Button.Add label='Add Trip Template' onPress={redirectToTripTemplate} />
                    </Button.Row>
                </View>
            ) : (
                <FlatList
                    data={tripTemplates}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{
                        gap: 8,
                        flexGrow: 1
                    }}
                    columnWrapperStyle={{ gap: 8 }}
                    keyboardShouldPersistTaps={'always'}
                    ListHeaderComponent={EmptyHeaderComponent}
                    ListHeaderComponentStyle={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                />
            )}
            <Input.Header style={{ width: '100%', textAlign: 'center' }}>or</Input.Header>
            <Button.Row>
                <Button.Add label={`Add Custom Trip`} onPress={() => console.log('add custom trip')} disabled />
                <Button.Add label={`Add Single Ride`} onPress={redirectToAddRide} />
            </Button.Row>
        </Container>
    )
}