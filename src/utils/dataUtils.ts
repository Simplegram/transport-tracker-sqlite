import { ManageableLap } from "@/components/modal/FlatlistPicker"
import { CompleteRide, CompleteStopVehicleTypes, MergedStopVehicleType } from "../types/CompleteTypes"
import { getCleanMomentTime } from "./dateUtils"

export interface DataItemWithNewKey extends CompleteRide {
    lapCount: number
}

export const getGroupedData = (data: CompleteRide[], laps: ManageableLap[]) => {
    const groupedData = data.reduce((acc, currentItem) => {
        const directionName = currentItem.direction.name || 'Unassigned Direction'
        const directionKey = directionName

        if (!acc[directionKey]) {
            acc[directionKey] = []
        }
        acc[directionKey].push(currentItem)
        return acc
    }, {} as Record<string, CompleteRide[]>)

    const sortedGroupedData: Record<string, CompleteRide[]> = {}
    Object.keys(groupedData).forEach(directionKey => {
        sortedGroupedData[directionKey] = groupedData[directionKey].sort((a, b) => {
            const timeA = (a.created_at && new Date(a.created_at).getTime()) || Infinity
            const timeB = (b.created_at && new Date(b.created_at).getTime()) || Infinity

            return timeB - timeA
        })
    })

    const finalGroupedDataWithNewKey: Record<string, DataItemWithNewKey[]> = {}
    Object.keys(sortedGroupedData).forEach(directionKey => {
        finalGroupedDataWithNewKey[directionKey] = sortedGroupedData[directionKey].map(item => {
            const matchingLaps = laps.filter(lap => lap.ride_id === item.id)
            const lapCount = matchingLaps.length

            return {
                ...item,
                lapCount: lapCount
            }
        })
    })

    return finalGroupedDataWithNewKey
}

export function getKeysSortedByCreatedAt(data: Record<string, DataItemWithNewKey[]>) {
    const keys = Object.keys(data)

    keys.sort((a, b) => {
        const createdAtA = new Date(data[a][0].created_at)
        const createdAtB = new Date(data[b][0].created_at)
        return createdAtA - createdAtB
    })

    return keys
}

export function sortLaps(laps: ManageableLap[]) {
    const sortedLaps = laps.sort((a, b) => {
        return getCleanMomentTime(b.time).diff(getCleanMomentTime(a.time))
    })

    return sortedLaps
}

export function mergeStopVehicleTypesByStopId(items: CompleteStopVehicleTypes[]) {
    const result: { [stopId: number]: MergedStopVehicleType } = {}

    items.forEach(item => {
        const { stop_id, ...vehicleTypes } = item

        if (!result[stop_id]) {
            result[stop_id] = {
                stop_id: stop_id,
                vehicle_types: []
            }
        }
        result[stop_id].vehicle_types.push({
            id: vehicleTypes.vehicle_type_id,
            name: vehicleTypes.vehicle_type_name,
            icon_id: vehicleTypes.icon_id,
            icon_name: vehicleTypes.icon_name
        })
    })

    return Object.values(result)
}

interface ElementMoverProps {
    array: any[]
    originalIndex: number
    direction: 'before' | 'next'
}

export function moveElementOneStep({ array, originalIndex, direction }: ElementMoverProps) {
    // 1. Basic Validation
    if (!Array.isArray(array) || array.length === 0) {
        console.warn("Input is not a valid array or is empty.")
        return array // Return original array if invalid
    }

    if (originalIndex < 0 || originalIndex >= array.length) {
        console.warn("Original index is out of bounds.")
        return array // Return original array if index is invalid
    }

    // Determine the target index based on direction
    let newIndex
    if (direction === 'before') {
        newIndex = originalIndex - 1
    } else if (direction === 'next') {
        newIndex = originalIndex + 1
    } else {
        console.warn("Invalid direction. Use 'left' or 'right'.")
        return array // Return original array if direction is invalid
    }

    // 2. Check if the new index is valid (within array bounds)
    if (newIndex < 0 || newIndex >= array.length) {
        console.log(`Cannot move ${direction}. Element is already at the ${direction === 'before' ? 'beginning' : 'end'}.`)
        return array // Return the original array as no move is possible
    }

    // 3. Perform the swap (the core logic)
    // Create a shallow copy to avoid modifying the original array directly if you want immutability
    const newArr = [...array] // Or just arr if you're okay with direct modification

    const elementToMove = newArr[originalIndex]
    newArr[originalIndex] = newArr[newIndex]
    newArr[newIndex] = elementToMove

    return newArr
}