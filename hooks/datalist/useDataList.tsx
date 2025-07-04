import { useDataEditContext } from "@/context/DataEditContext"
import { CompleteRoute, CompleteStop, CompleteStopVehicleTypes, CompleteVehicleType } from "@/src/types/CompleteTravels"
import { Direction, IconType, Route, Stop, VehicleType } from "@/src/types/Travels"
import { useEffect, useState } from "react"

interface UseDatalistProps {
    directions: Direction[]
    stops: CompleteStop[]
    stopVehicleTypes: CompleteStopVehicleTypes[]
    routes: CompleteRoute[]
    vehicleTypes: CompleteVehicleType[]
    icons: IconType[]
}

export default function useDataList({ directions, stops, stopVehicleTypes, routes, vehicleTypes, icons }: UseDatalistProps) {
    const { editCategory: dataType } = useDataEditContext()

    const [data, setData] = useState<Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]>([])
    const [filteredData, setFilteredData] = useState<Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')


    const filteredStops = (data: Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]) => {
        if (!data) return []
        const query = searchQuery.toLowerCase()

        const filteredData = data.filter(item => {
            if (dataType === "Routes") {
                const routeItem = item as CompleteRoute

                return routeItem.name.toLowerCase().includes(query) || routeItem.code.toLowerCase().includes(query) || routeItem.vehicle_type.name.toLowerCase().includes(query)
            } else if (dataType === "Stops") {
                const stopItem = item as Stop

                // Check if stop name matches
                const itemName = (item as { name: string }).name.toLowerCase()
                const nameMatches = itemName.includes(query)

                // Check if any associated vehicle type name matches the query
                const vehicleTypeMatches = stopVehicleTypes.some(svt =>
                    svt.stop_id === stopItem.id &&
                    svt.vehicle_type_name.toLowerCase().includes(query)
                )

                return nameMatches || vehicleTypeMatches
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