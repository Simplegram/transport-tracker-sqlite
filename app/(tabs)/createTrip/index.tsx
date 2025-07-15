import Button from "@/components/button/BaseButton"
import DataButtonBase from "@/components/button/DatalistButton"
import Container from "@/components/Container"
import Input from "@/components/input/Input"
import { EmptyHeaderComponent } from "@/components/ride/RidesFlatlist"
import useTripTemplates from "@/hooks/data/templates/useTripTemplates"
import useCreateTrip from "@/hooks/trips/useCreateTrip"
import { TripTemplate } from "@/src/types/data/TripTemplates"
import { router, useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { View } from "react-native"
import { FlatList } from "react-native-gesture-handler"

export default function TripHome() {
    const { tripTemplates, getTripTemplates } = useTripTemplates()

    const { createTripFromTemplate } = useCreateTrip()

    const useTripTemplate = (tripTemplateId: number) => {
        createTripFromTemplate(tripTemplateId)
        router.push('/(tabs)/createTrip/ridesList')
    }

    useFocusEffect(
        useCallback(() => {
            getTripTemplates()
        }, [])
    )

    const renderItem = (item: TripTemplate) => (
        <DataButtonBase.TripTemplateButton
            onPress={() => useTripTemplate(item.id)}
        >
            <Input.Subtitle>{item.name}</Input.Subtitle>
            <Input.ValueText>{item.description}</Input.ValueText>
        </DataButtonBase.TripTemplateButton>
    )

    return (
        <Container style={{
            flex: 1
        }}>
            {tripTemplates.length === 0 ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Input.Title>No trip templates available to display</Input.Title>
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
                <Button.Add label={`Add Custom Trip`} onPress={() => console.log('masuk')} />
            </Button.Row>
        </Container>
    )
}