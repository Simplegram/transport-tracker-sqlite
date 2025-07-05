import { CompleteStop } from "./CompleteTypes"
import { IconType } from "./Types"

export interface ModalProp {
    onSubmit: (data: any) => void
    onCancel: () => void
    stops?: CompleteStop[]
}

export interface VehicleTypeModalProp {
    onSubmit: (data: any) => void
    onCancel: () => void
    icons?: IconType[]
}