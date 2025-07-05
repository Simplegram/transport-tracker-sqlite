import { CompleteStop } from "./CompleteTypes"

interface AddableDirection {
    name: string | undefined
}

interface AddableStop {
    name: string | undefined
    lat: number | null
    lon: number | null
    name_alt: string | null
    vehicle_type_ids: number[]
}

interface AddableRoute {
    first_stop_id: number
    last_stop_id: number
    code: string | null
    name: string
    vehicle_type_id: number
}

interface AddableVehicleType {
    name: string | undefined,
    icon_id: number | undefined,
}

interface AddableIconType {
    name: string | undefined
}

interface AddableRide {
    created_at: string | undefined
    bus_initial_arrival: string | null
    bus_initial_departure: string | null
    bus_final_arrival: string | null
    notes: string | null
    vehicle_code: string | null
    route_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    direction_id: number | undefined
    vehicle_type_id: number | undefined
}

interface AddableLap {
    id?: number | string
    ride_id?: number | undefined
    time: string | undefined
    lat: number | null
    lon: number | null
    stop_id: number | null
    note: string | null
}

interface AddableCoordinates {
    lon: number | null | undefined
    lat: number | null | undefined
}

export interface AddableStopVehicleTypes {
    stop_id?: number
    vehicle_type_id: number
}

export interface StandaloneModalProp {
    isModalVisible: boolean
    onClose: () => void
    onSelect: (data: any) => void
}

interface AddableCoordModalProp {
    currentCoordinates: AddableCoordinates | undefined
    isModalVisible: boolean
    onClose: () => void
    onSelect: (coordinates: AddableCoordinates) => void
}

interface AddableLapsModalProp {
    currentLaps: AddableLap[]
    stops: CompleteStop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (laps: AddableLap[]) => void
}

interface AddableLapModalProp {
    ride_id?: number
    stops: CompleteStop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: AddableLap) => void
}

export interface AddableTrip {
    name: string | null
    created_at: string | undefined
    description: string | null
    template_id: number | null
    started_at: string | null
    completed_at: string | null
}

export {
    AddableCoordinates, AddableCoordModalProp, AddableDirection, AddableIconType, AddableLap, AddableLapModalProp, AddableLapsModalProp, AddableRide, AddableRoute, AddableStop, AddableVehicleType
}

