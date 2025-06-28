import { DialogProvider } from '@/context/DialogContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Layout() {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <DialogProvider>
                    <GestureHandlerRootView>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>
                    </GestureHandlerRootView>
                </DialogProvider>
            </ThemeProvider>
        </SettingsProvider>
    )
}
