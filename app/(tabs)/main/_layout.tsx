import { TravelProvider } from "@/context/TravelContext"
import { TripProvider } from "@/context/TripContext"
import { Stack } from "expo-router"

export default function Layout() {
    return (
        <TravelProvider>
            <TripProvider>
                <Stack screenOptions={{
                    headerShown: false,
                    animation: "ios_from_right",
                }}>
                    <Stack.Screen
                        name="index"
                    />
                    <Stack.Screen
                        name="editRide"
                    />
                    <Stack.Screen
                        name="travelDetail"
                    />
                    <Stack.Screen
                        name="tripDetail"
                    />
                    <Stack.Screen
                        name="estimate"
                    />
                </Stack>
            </TripProvider>
        </TravelProvider>
    )
}