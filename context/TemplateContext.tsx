import { createContext, PropsWithChildren, useContext, useState } from "react"

interface TemplateContextValue {
    tripTemplateId: number | undefined
    setTripTemplateId: (id: number) => void
    rideTemplateId: number | undefined
    setRideTemplateId: (id: number) => void
}

export const TemplateContext = createContext<TemplateContextValue | undefined>(undefined)

export const TemplateProvider = ({ children }: PropsWithChildren) => {
    const [tripTemplateId, setTripTemplateId] = useState<number | undefined>(undefined)
    const [rideTemplateId, setRideTemplateId] = useState<number | undefined>(undefined)

    return (
        <TemplateContext.Provider value={{
            tripTemplateId, setTripTemplateId,
            rideTemplateId, setRideTemplateId
        }}>
            {children}
        </TemplateContext.Provider>
    )
}

export function useTemplateContext() {
    const templateContext = useContext(TemplateContext)
    if (templateContext === undefined) {
        throw new Error('useTemplateContext must be used within a TemplateProvider')
    }
    return templateContext
}