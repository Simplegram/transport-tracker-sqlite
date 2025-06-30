import { Direction } from "./Travels"

export interface CompleteStop {
    id: number
    name: string
    lat: number | null
    lon: number | null
    name_alt: string | null
    vehicle_types: CompleteVehicleType[]
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
    vehicle_type: CompleteVehicleType
}

export interface CompleteStopVehicleTypes {
    stop_id: number
    vehicle_type_id: number
    vehicle_type_name: string
    icon_id: number
    icon_name: string
}

export interface MergedStopVehicleType {
    stop_id: number
    vehicle_types: CompleteVehicleType[]
}

export interface CompleteTravel {
    id: number
    created_at: string
    bus_initial_arrival: string | null
    bus_initial_departure: string | null
    bus_final_arrival: string | null
    routes: CompleteRoute
    first_stop: CompleteStop
    last_stop: CompleteStop
    notes: string | null
    vehicle_code: string | null
    direction: Direction
    vehicle_type: CompleteVehicleType
}