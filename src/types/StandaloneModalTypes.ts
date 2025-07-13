export interface StandaloneModalProps {
    isModalVisible: boolean
    onSubmit: (item: any) => void
    onDelete?: (id: number) => void
    onClose: () => void
}

export interface EditableTripModalProps extends StandaloneModalProps {
    tripTemplateId: number
}

export interface EditableRideModalProps extends StandaloneModalProps {
    rideTemplateId: number
}