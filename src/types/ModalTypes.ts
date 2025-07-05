import { CompleteStop } from "./CompleteTypes"
import { BaseModalContentProps } from "./ModalContentProps"
import { IconType } from "./Types"

export interface RouteModalProp extends BaseModalContentProps {
    stops?: CompleteStop[]
}

export interface VehicleTypeModalProp {
    onSubmit: (data: any) => void
    onCancel: () => void
    icons?: IconType[]
}