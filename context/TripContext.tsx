import { CompleteTrip } from "@/src/types/CompleteTypes"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TripContextValue {
    tripId: number | undefined
    setTripId: (id: number) => void
    currentTrip: CompleteTrip | undefined
    setCurrentTrip: (trip: CompleteTrip) => void
}

export const TripContext = createContext<TripContextValue | undefined>(undefined)

export const TripProvider = ({ children }: PropsWithChildren) => {
    const [tripId, setTripId] = useState<number | undefined>(undefined)
    const [currentTrip, setCurrentTrip] = useState<CompleteTrip | undefined>(undefined)

    return (
        <TripContext.Provider value={{
            tripId, setTripId,
            currentTrip, setCurrentTrip
        }}>
            {children}
        </TripContext.Provider>
    )
}

export function useTripContext() {
    const context = useContext(TripContext)
    if (context === undefined) {
        throw new Error('useTripContext must be used within a TripProvider')
    }
    return context
}