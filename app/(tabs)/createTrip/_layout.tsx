import { TripProvider } from "@/context/TripContext"
import { Stack } from "expo-router"

export default function Layout() {
    return (
        <TripProvider>
            <Stack screenOptions={{
                headerShown: false,
                animation: "ios_from_right",
            }}>
                <Stack.Screen
                    name="index"
                />
            </Stack>
        </TripProvider>
    )
}