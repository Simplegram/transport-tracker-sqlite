import { CompleteTrip } from "@/src/types/CompleteTypes"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TripContextValue {
    tripId: number | null
    setTripId: (id: number) => void
    currentTrip: CompleteTrip | null
    setCurrentTrip: (trip: CompleteTrip | null) => void
}

export const TripContext = createContext<TripContextValue | null>(null)

export const TripProvider = ({ children }: PropsWithChildren) => {
    const [tripId, setTripId] = useState<number | null>(null)
    const [currentTrip, setCurrentTrip] = useState<CompleteTrip | null>(null)

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
    if (context === null) {
        throw new Error('useTripContext must be used within a TripProvider')
    }
    return context
}