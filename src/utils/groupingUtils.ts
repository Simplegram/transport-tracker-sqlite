import { CompleteStop, CompleteVehicleType } from "../types/CompleteTravels"

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