export interface LapTemplate {
    id: number
    ride_template_id: number
    sequence_order: number
    stop_id: number
    note: string
}

export interface AddableLapTemplate {
    ride_template_id: number | undefined
    sequence_order: number | undefined
    stop_id: number | undefined
    note: string | null
}