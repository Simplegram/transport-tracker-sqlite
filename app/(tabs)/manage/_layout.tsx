import { DataEditProvider } from "@/context/DataEditContext"
import { TemplateProvider } from "@/context/TemplateContext"
import { Stack } from "expo-router"

export default function Layout() {
    return (
        <DataEditProvider>
            <TemplateProvider>
                <Stack screenOptions={{
                    headerShown: false,
                    animation: "ios_from_right",
                }}>
                    <Stack.Screen
                        name="index"
                    />
                    <Stack.Screen
                        name="datalist"
                    />
                    <Stack.Screen
                        name="settings"
                    />
                </Stack>
            </TemplateProvider>
        </DataEditProvider>
    )
}