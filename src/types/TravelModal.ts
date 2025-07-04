import { CompleteStop } from "./CompleteTravels"
import { IconType } from "./Travels"

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