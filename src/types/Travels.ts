export interface Direction {
    id: number
    name: string
}

export interface Stop {
    id: number,
    name: string,
    lat?: number,
    lon?: number,
    name_alt?: string,
}

export interface Route {
    id: number
    first_stop_id: number
    last_stop_id: number
    code: string
    name: string
    vehicle_type_id: number
}

export interface VehicleType {
    id: number
    name: string,
    icon_id: number,
}

export interface IconType {
    id: number,
    name: string
}

export interface Travel {
    id: number
    created_at: string
    bus_initial_arrival: string | null
    bus_initial_departure: string | null
    bus_final_arrival: string | null
    route_id: number
    first_stop_id: number
    last_stop_id: number
    notes: string | null
    vehicle_code: string | null
    direction_id: number
    vehicle_type_id: number
}

export interface Lap {
    id: number
    travel_id: number
    time: string
    stop_id: number | null
    note: string | null
}

export interface FullLap {
    id: number
    travel_id: number
    time: string
    lon: number | null
    lat: number | null
    stop_id: Stop | null
    note: string | null
}

export interface Coordinates {
    lon: number
    lat: number
}

export interface AverageTimes {
    [key: string]: number
    avg_travel_time: number
    avg_top_5_longest: number
    min_top_5_longest: number
    max_top_5_longest: number
    avg_top_5_shortest: number
    min_top_5_shortest: number
    max_top_5_shortest: number
}

export interface TravelTimeData {
    [key: string]: AverageTimes
}

export interface StopVehicleTypes {
    stop_id: number
    vehicle_type_id: number
}
