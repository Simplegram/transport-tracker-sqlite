import { useDataEditContext } from "@/context/DataEditContext"
import { CompleteRoute, CompleteStop, CompleteVehicleType } from "@/src/types/CompleteTravels"
import { Direction, IconType, Route, Stop, VehicleType } from "@/src/types/Travels"
import { useEffect, useState } from "react"

interface UseDatalistProps {
    directions: Direction[]
    stops: CompleteStop[]
    routes: CompleteRoute[]
    vehicleTypes: CompleteVehicleType[]
    icons: IconType[]
}

export default function useDataList({ directions, stops, routes, vehicleTypes, icons }: UseDatalistProps) {
    const { editCategory: dataType } = useDataEditContext()

    const [data, setData] = useState<Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]>([])
    const [filteredData, setFilteredData] = useState<Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')

    const filteredStops = (data: Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]) => {
        if (!data) return []
        const query = searchQuery.toLowerCase()

        const filteredData = data.filter(item => {
            if (dataType === "Routes") {
                return item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)
            } else if (dataType === "Stops") {
                return item.name.toLowerCase().includes(query) || item.vehicle_type_name.toLowerCase().includes(query)
            } else {
                return item.name.toLowerCase().includes(query)
            }
        })

        return filteredData
    }

    let fetchedData: Direction[] | Stop[] | Route[] | VehicleType[] | IconType[] = []
    useEffect(() => {
        switch (dataType) {
            case 'Directions':
                fetchedData = directions
                break
            case 'Stops':
                fetchedData = stops
                break
            case 'Routes':
                fetchedData = routes
                break
            case 'VehicleTypes':
                fetchedData = vehicleTypes
                break
            case 'Icons':
                fetchedData = icons
                break
            default:
                fetchedData = []
                break
        }

        setData(fetchedData)
        setFilteredData(filteredStops(fetchedData))
    }, [dataType, directions, stops, routes, vehicleTypes, icons])

    useEffect(() => {
        setFilteredData(filteredStops(data))
    }, [searchQuery])

    return {
        dataType,
        filteredData, data,
        searchQuery, setSearchQuery,
    }
}