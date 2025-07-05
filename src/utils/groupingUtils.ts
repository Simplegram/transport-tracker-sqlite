import { CompleteLap, CompleteRoute, CompleteStop, CompleteTravel, CompleteVehicleType } from "../types/CompleteTravels"

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
                vehicle_type: {
                    id: row.vehicle_type_id,
                    name: row.vehicle_type_name,
                    icon_id: row.icon_id,
                    icon_name: row.icon_name
                }
            })
        }
    }

    return Array.from(routesMap.values())
}

export const groupTravels = (rows: any[]): CompleteTravel[] => {
    const travelsMap = new Map<number, CompleteTravel>()

    for (const row of rows) {
        const travelId = row.id

        if (!travelsMap.has(travelId)) {
            travelsMap.set(travelId, {
                id: row.id,
                created_at: row.created_at,
                bus_initial_arrival: row.bus_initial_arrival,
                bus_initial_departure: row.bus_initial_departure,
                bus_final_arrival: row.bus_final_arrival,
                vehicle_code: row.vehicle_code,
                notes: row.notes,

                route: {
                    id: row.route_id,
                    code: row.route_code,
                    name: row.route_name,
                    first_stop_id: row.route_first_stop_id,
                    last_stop_id: row.route_last_stop_id,
                    vehicle_type_id: row.vehicle_type_id
                },
                first_stop: {
                    id: row.first_stop_id,
                    name: row.first_stop_name,
                    lat: row.first_stop_lat,
                    lon: row.first_stop_lon
                },
                last_stop: {
                    id: row.last_stop_id,
                    name: row.last_stop_name,
                    lat: row.last_stop_lat,
                    lon: row.last_stop_lon
                },
                direction: {
                    id: row.direction_id,
                    name: row.direction_name
                },
                vehicle_type: {
                    id: row.vehicle_type_id,
                    name: row.vehicle_type_name,
                    icon_id: row.icon_id,
                    icon_name: row.icon_name
                },
            })
        }
    }

    return Array.from(travelsMap.values())
}

export const groupLapsWithStop = (rows: any[]): CompleteLap[] => {
    const lapsMap = new Map<number, CompleteLap>()

    for (const row of rows) {
        const routeId = row.id

        if (!lapsMap.has(routeId)) {
            lapsMap.set(routeId, {
                id: row.id,
                ride_id: row.ride_id,
                time: row.time,
                lat: row.lat,
                lon: row.lon,
                note: row.note,
                stop: {
                    id: row.stop_id,
                    name: row.stop_name,
                    lat: row.stop_lat,
                    lon: row.stop_lon,
                    name_alt: row.stop_name_alt
                }
            })
        }
    }

    return Array.from(lapsMap.values())
}