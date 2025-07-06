export interface RideTemplate {
    id: number
    trip_template_id: number
    sequence_order: number
    route_id: number
    vehicle_type_id: number
    first_stop_id: number
    last_stop_id: number
    notes: string | null
}

export interface AddableRideTemplate {
    trip_template_id: number | undefined
    sequence_order: number | undefined
    route_id: number | undefined
    vehicle_type_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    notes: string | null
}