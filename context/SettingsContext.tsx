import React, { createContext, PropsWithChildren, useContext } from "react"
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv"

interface SettingsContextType {
    enableVibration: boolean
    setEnableVibration: (key: boolean) => void
    travelDisplayMode: 'card' | 'list'
    setTravelDisplayMode: (key: 'card' | 'list') => void
    directLapSave: boolean
    setDirectLapSave: (key: boolean) => void
    directRideLapSave: boolean
    setDirectRideLapSave: (key: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const [enableVibration = true, setEnableVibration] = useMMKVBoolean('settings.vibration')
    const [travelDisplayMode = 'card', setTravelDisplayMode] = useMMKVObject<'card' | 'list'>('settings.travelDisplayMode')
    const [directLapSave = false, setDirectLapSave] = useMMKVBoolean('settings.laps.directLapSave')
    const [directRideLapSave = false, setDirectRideLapSave] = useMMKVBoolean('settings.laps.directRideSaveAfterLap')

    return (
        <SettingsContext.Provider value={{
            enableVibration, setEnableVibration,
            travelDisplayMode, setTravelDisplayMode,
            directLapSave, setDirectLapSave,
            directRideLapSave, setDirectRideLapSave
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