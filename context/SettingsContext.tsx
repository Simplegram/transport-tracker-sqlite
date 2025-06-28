import React, { createContext, PropsWithChildren, useContext } from "react"
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv"

interface SettingsContextType {
    enableVibration: boolean
    setEnableVibration: (key: boolean) => void
    travelDisplayMode: 'card' | 'list'
    setTravelDisplayMode: (key: 'card' | 'list') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const [enableVibration = true, setEnableVibration] = useMMKVBoolean('settings.vibration')
    const [travelDisplayMode = 'card', setTravelDisplayMode] = useMMKVObject<'card' | 'list'>('settings.travelDisplayMode')

    return (
        <SettingsContext.Provider value={{
            enableVibration, setEnableVibration,
            travelDisplayMode, setTravelDisplayMode,
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}