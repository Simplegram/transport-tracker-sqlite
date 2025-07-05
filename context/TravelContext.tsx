import { CompleteRide } from "@/src/types/CompleteTypes"
import { Ride } from "@/src/types/Types"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TravelContextValue {
    selectedRide: any | undefined
    setSelectedRide: (item: any | undefined) => void
    selectedRides: CompleteRide[] | undefined
    setSelectedRides: (items: CompleteRide[] | undefined) => void
}

export const TravelContext = createContext<TravelContextValue | undefined>(undefined)

export const TravelProvider = ({ children }: PropsWithChildren) => {
    const [selectedRide, setSelectedRide] = useState<Ride | undefined>(undefined)
    const [selectedRides, setSelectedRides] = useState<CompleteRide[] | undefined>(undefined)

    return (
        <TravelContext.Provider value={{
            selectedRide,
            setSelectedRide,
            selectedRides,
            setSelectedRides
        }}>
            {children}
        </TravelContext.Provider>
    )
}

export function useTravelContext() {
    const travelItem = useContext(TravelContext)
    if (travelItem === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider')
    }
    return travelItem
}