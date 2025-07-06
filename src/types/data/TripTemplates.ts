export interface TripTemplate {
    id: number
    name: string
    created_at: string
    description: string | null
}

export interface AddableTripTemplate {
    name: string | undefined
    created_at: string | undefined
    description: string | null
}

export interface EditableTripTemplate {
    id: number
    name: string
    created_at: string
    description: string | null
}