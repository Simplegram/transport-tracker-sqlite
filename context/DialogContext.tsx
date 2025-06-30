import DialogBase, { DialogButton, DialogContent } from "@/components/modal/Dialog"
import React, { createContext, PropsWithChildren, useContext, useState } from "react"

interface ContextType {
    dialog: (label: string, content: string, buttons?: DialogButton[]) => void
    setShowDialog: (key: boolean) => void
}

const DialogContext = createContext<ContextType | undefined>(undefined)

export const DialogProvider = ({ children }: PropsWithChildren) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [dialogContent, setDialogContent] = useState<DialogContent>({
        label: '',
        content: '',
        buttons: []
    })

    const dialog = (label: string, content: string, buttons: DialogButton[] = []) => {
        setDialogContent({
            ...dialogContent,
            label: label,
            content: content,
            buttons: (buttons.length === 0) ? [{ text: 'OK', onPress: () => setShowDialog(false) }] : buttons
        })
        setShowDialog(true)
    }

    return (
        <DialogContext.Provider value={{ dialog, setShowDialog }}>
            {children}
            <DialogBase visible={showDialog}>
                <DialogBase.Information {...dialogContent} />
            </DialogBase>
        </DialogContext.Provider>
    )
}

export const useDialog = () => {
    const context = useContext(DialogContext)
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider')
    }
    return context
}