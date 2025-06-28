import { IconType, Stop } from "./Travels"

export interface ModalProp {
    onSubmit: (data: any) => void
    onCancel: () => void
    stops?: Stop[]
}

export interface VehicleTypeModalProp {
    onSubmit: (data: any) => void
    onCancel: () => void
    icons?: IconType[]
}