import { ManageableLap } from "@/components/modal/FlatlistPicker"
import { CompleteRoute, CompleteStop } from "./CompleteTravels"
import { Direction, Stop, VehicleType } from "./Travels"

interface EditableStop {
    id: number
    name: string
    lat: number | null
    lon: number | null
    name_alt: string | null
    vehicle_type_ids: number[]
    removed_type_ids?: number[]
}

interface EditableVehicleType {
    id: number
    name: string
    icon_id: number
}

interface EditableRoute {
    id: number
    first_stop_id: number
    last_stop_id: number
    code: string
    name: string
    vehicle_type: VehicleType
    vehicle_type_id: number
}

interface EditableTravel {
    id: number
    bus_initial_arrival: string
    bus_initial_departure: string
    bus_final_arrival: string
    notes: string
    vehicle_code: string
    route_id: number | null
    first_stop_id: number | null
    last_stop_id: number | null
    direction_id: number | null
    vehicle_type_id: number | null
}

interface EditableLap {
    id: number
    ride_id: number
    lat: number | null
    lon: number | null
    time: string
    stop_id: number | undefined
    note: string | undefined
}

interface EditableTravelModalProp {
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

export interface EditableTravelRouteModalProp {
    routes: CompleteRoute[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

export interface EditableTravelDirectionModalProp {
    directions: Direction[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

interface EditableTravelStopModalProp {
    stops: CompleteStop[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
    vehicleTypeId?: number | null
}

interface EditableLapsModalProp {
    ride_id: number
    currentLaps: ManageableLap[]
    stops: CompleteStop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: ManageableLap[]) => void
}

interface EditableLapModalProp {
    stops: CompleteStop[]
    selectedLap: ManageableLap
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: ManageableLap) => void
}

export {
    EditableLap, EditableLapModalProp, EditableLapsModalProp, EditableRoute, EditableStop, EditableTravel, EditableTravelModalProp, EditableTravelStopModalProp, EditableVehicleType
}

