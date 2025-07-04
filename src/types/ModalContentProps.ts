export interface BaseModalContentProps {
    onSubmit: (data: any) => void
    onDelete?: (key: any) => void
    onCancel: () => void
}

export interface AddDirectionData {
    name: string
}

export interface AddStopData {
    name: string
    location: string
}