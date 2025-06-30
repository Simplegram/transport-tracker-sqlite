import { Travel } from "@/src/types/Travels"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TravelContextValue {
    selectedItem: any | undefined
    setSelectedItem: (item: any | undefined) => void
    selectedTravelItems: Travel[] | undefined
    setSelectedTravelItems: (items: Travel[] | undefined) => void
}

export const TravelContext = createContext<TravelContextValue | undefined>(undefined)

export const TravelProvider = ({ children }: PropsWithChildren) => {
    const [selectedItem, setSelectedItem] = useState<Travel | undefined>(undefined)
    const [selectedTravelItems, setSelectedTravelItems] = useState<Travel[] | undefined>(undefined)

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