import { createContext, PropsWithChildren, useContext, useState } from "react"

interface DataEditContextValue {
    modalData: any | undefined
    setModalData: any | undefined
    editCategory: string | undefined
    setEditCategory: (item: string | undefined) => void
}

export const DataEditContext = createContext<DataEditContextValue | undefined>(undefined)

export const DataEditProvider = ({ children }: PropsWithChildren) => {
    const [modalData, setModalData] = useState<string | undefined>(undefined)
    const [editCategory, setEditCategory] = useState<string | undefined>(undefined)

    return (
        <DataEditContext.Provider value={{
            modalData, setModalData,
            editCategory, setEditCategory
        }}>
            {children}
        </DataEditContext.Provider>
    )
}

export const useDataEditContext = () => {
    const context = useContext(DataEditContext)

    if (context === undefined) {
        throw new Error('useDataEditContext must be used within a DataEditProvider')
    }

    return context
}