import { CompleteRoute, CompleteStop, CompleteVehicleType } from "../types/CompleteTravels"

export const groupStopsWithVehicleTypes = (rows: any[]): CompleteStop[] => {
    const stopsMap = new Map<number, CompleteStop>()

    for (const row of rows) {
        const stopId = row.id

        // Get or create stop
        if (!stopsMap.has(stopId)) {
            stopsMap.set(stopId, {
                id: row.id,
                name: row.name,
                name_alt: row.name_alt,
                lat: row.lat,
                lon: row.lon,
                vehicle_types: []
            })
        }

        const stop = stopsMap.get(stopId)!

        // Add vehicle type if it exists (LEFT JOIN might return null)
        if (row.vehicle_type_id) {
            const vehicleType: CompleteVehicleType = {
                id: row.vehicle_type_id,
                name: row.vehicle_type_name,
                icon_id: row.icon_id,
                icon_name: row.icon_name
            }

            // Avoid duplicates (in case of data issues)
            if (!stop.vehicle_types!.some(vt => vt.id === vehicleType.id)) {
                stop.vehicle_types!.push(vehicleType)
            }
        }
    }

    return Array.from(stopsMap.values())
}

export const groupRoutesWithVehicleTypes = (rows: any[]): CompleteRoute[] => {
    const routesMap = new Map<number, CompleteRoute>()

    for (const row of rows) {
        const routeId = row.id

        if (!routesMap.has(routeId)) {
            routesMap.set(routeId, {
                id: row.id,
                first_stop_id: row.first_stop_id,
                last_stop_id: row.last_stop_id,
                code: row.code,
                name: row.name,
                vehicle_type: row.vehicle_type
            })
        }

        const route = routesMap.get(routeId)!

        if (row.vehicle_type_id) {
            const vehicleType: CompleteVehicleType = {
                id: row.vehicle_type_id,
                name: row.vehicle_type_name,
                icon_id: row.icon_id,
                icon_name: row.icon_name
            }

            route.vehicle_type = vehicleType
        }
    }

    return Array.from(routesMap.values())
}