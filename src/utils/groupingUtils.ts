import { CompleteLap, CompleteRide, CompleteRoute, CompleteStop, CompleteTrip, CompleteVehicleType } from "../types/CompleteTypes"

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

export const groupRides = (rows: any[]): CompleteRide[] => {
    const ridesMap = new Map<number, CompleteRide>()

    for (const row of rows) {
        const rideId = row.id

        if (!ridesMap.has(rideId)) {
            ridesMap.set(rideId, {
                id: row.id,
                trip_id: row.trip_id || null,
                created_at: row.created_at,
                bus_initial_arrival: row.bus_initial_arrival,
                bus_initial_departure: row.bus_initial_departure,
                bus_final_arrival: row.bus_final_arrival,
                vehicle_code: row.vehicle_code,
                sequence_order: row.sequence_order,
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

    return Array.from(ridesMap.values())
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

export const groupTrips = (rows: any[]): CompleteTrip[] => {
    const tripsMap = new Map<number, CompleteTrip>()

    for (const row of rows) {
        const tripId = row.id
        const rideId = row.ride_id

        let trip
        if (tripsMap.has(tripId)) trip = tripsMap.get(tripId)

        let tripRides: CompleteRide[] = []
        if (trip) tripRides = [...trip.rides]

        tripRides.push({
            id: row.ride_id,
            trip_id: row.ride_trip_id,
            created_at: row.ride_created_at,
            bus_initial_arrival: row.ride_initial_arrival,
            bus_initial_departure: row.ride_initial_departure,
            bus_final_arrival: row.ride_final_arrival,
            vehicle_code: row.ride_vehicle_code,
            sequence_order: row.ride_sequence_order,
            notes: row.ride_notes,

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
                id: row.direction_id || null,
                name: row.direction_name || null
            },
            vehicle_type: {
                id: row.vehicle_type_id,
                name: row.vehicle_type_name,
                icon_id: row.icon_id,
                icon_name: row.icon_name
            },
        })

        tripsMap.set(tripId, {
            id: row.id,
            name: row.name,
            created_at: row.created_at,
            description: row.description,
            template_id: row.template_id,
            started_at: row.started_at,
            completed_at: row.completed_at,
            rides: [...tripRides]
        })
    }

    return Array.from(tripsMap.values())
}