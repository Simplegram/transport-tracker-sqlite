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
    vehicle_type?: VehicleType
}

export interface Route {
    id: number
    first_stop_id: Stop
    last_stop_id: Stop
    code: string
    name: string
    vehicle_type: VehicleType
}

export interface VehicleType {
    id: number
    name: string,
    icon_id: IconType,
}

export interface IconType {
    id: number,
    name: string
}

export interface Travel {
    id: number
    created_at: string
    bus_initial_arrival: string
    bus_initial_departure: string
    bus_final_arrival: string
    routes: Route
    first_stop_id: Stop
    last_stop_id: Stop
    notes: string | null
    vehicle_code: string
    directions: Direction
    types: VehicleType
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
