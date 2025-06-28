import { createContext, PropsWithChildren, useContext, useState } from "react"

interface ModalContextValue {
    vehicleTypeId: number | null
    setVehicleTypeId: (item: number | null) => void
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const [vehicleTypeId, setVehicleTypeId] = useState<number | null>(null)

    return (
        <ModalContext.Provider value={{
            vehicleTypeId, setVehicleTypeId,
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModalContext() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModalContext must be used within a ModalProvider')
    }
    return context
}