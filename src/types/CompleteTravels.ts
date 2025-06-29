export interface CompleteStop {
    id: number
    name: string
    lat: number | null
    lon: number | null
    name_alt: string | null
    vehicle_type_id: number
    vehicle_type_name: string
    icon_id: number
    icon_name: string
}

export interface CompleteVehicleType {
    id: number
    name: string
    icon_id: number
    icon_name: string
}

export interface CompleteRoute {
    id: number
    first_stop_id: number
    last_stop_id: number
    code: string
    name: string
    vehicle_type_id: number
    vehicle_type_name: string
    icon_id: number
    icon_name: string
}

export interface CompleteStopVehicleTypes {
    stop_id: number
    vehicle_type_id: number
    vehicle_type_name: string
    icon_id: number
    icon_name: string
}