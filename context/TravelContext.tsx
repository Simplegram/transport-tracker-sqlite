import { CompleteRide } from "@/src/types/CompleteTravels"
import { Ride } from "@/src/types/Travels"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TravelContextValue {
    selectedItem: any | undefined
    setSelectedItem: (item: any | undefined) => void
    selectedTravelItems: CompleteRide[] | undefined
    setSelectedTravelItems: (items: CompleteRide[] | undefined) => void
}

export const TravelContext = createContext<TravelContextValue | undefined>(undefined)

export const TravelProvider = ({ children }: PropsWithChildren) => {
    const [selectedItem, setSelectedItem] = useState<Ride | undefined>(undefined)
    const [selectedTravelItems, setSelectedTravelItems] = useState<CompleteRide[] | undefined>(undefined)

    return (
        <TravelContext.Provider value={{
            selectedItem,
            setSelectedItem,
            selectedTravelItems,
            setSelectedTravelItems
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