import { db } from "@/src/services/dataDbService"
import { AddableTrip } from "@/src/types/AddableTypes"
import { CompleteTrip } from "@/src/types/CompleteTypes"
import { EditableTrip } from "@/src/types/EditableTypes"
import { Trip } from "@/src/types/Types"
import { groupTrips } from "@/src/utils/groupingUtils"
import { useEffect, useState } from "react"

export default function useTrips() {
    const [trips, setTrips] = useState<Trip[]>([])

    const getTrips = async () => {
        try {
            let result = await db.execute('SELECT * FROM trips')

            setTrips(result.rows as unknown as Trip[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTripById = (tripId: number, complete: boolean = false) => {
        const query = `
            SELECT * FROM trips
            WHERE id = ?
        `

        const completeQuery = `
            SELECT 
                tr.id,
                tr.name,
                tr.description,
                tr.template_id,
                tr.created_at,
                tr.started_at,
                tr.completed_at,

                rd.id AS ride_id,
                rd.trip_id AS ride_trip_id,
                rd.created_at AS ride_created_at, 
                rd.bus_initial_arrival AS ride_initial_arrival, 
                rd.bus_initial_departure AS ride_initial_departure, 
                rd.bus_final_arrival AS ride_final_arrival,
                rd.sequence_order AS ride_sequence_order,
                rd.notes AS ride_notes,
                rd.vehicle_code AS ride_vehicle_code,

                rt.id AS route_id,
                rt.code AS route_code,
                rt.name AS route_name,
                rt.first_stop_id AS route_first_stop_id,
                rt.last_stop_id AS route_last_stop_id,
                rt.vehicle_type_id as route_vehicle_type_id,

                fs.id AS first_stop_id,
                fs.name AS first_stop_name,
                fs.lat AS first_stop_lat,
                fs.lon AS first_stop_lon,

                ls.id AS last_stop_id,
                ls.name AS last_stop_name,
                ls.lat AS last_stop_lat,
                ls.lon AS last_stop_lon,

                vt.id AS vehicle_type_id,
                vt.name AS vehicle_type_name,

                ic.id AS icon_id,
                ic.name AS icon_name
            FROM trips tr
            JOIN rides rd ON rd.trip_id = tr.id
            JOIN routes rt ON rt.id = rd.route_id
            JOIN stops fs ON fs.id = rd.first_stop_id
            JOIN stops ls ON ls.id = rd.last_stop_id
            JOIN types vt ON vt.id = rt.vehicle_type_id
            JOIN icons ic ON ic.id = vt.icon_id
            WHERE tr.id = ?
        `

        try {
            let result = db.executeSync(complete ? completeQuery : query, [tripId])

            if (complete) {
                const trips = groupTrips(result.rows)
                return trips as CompleteTrip[]
            }

            return result.rows as unknown as Trip[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTripsByTimeBetween = (start_time: string, end_time: string, complete: boolean = false) => {
        const query = `
            SELECT * FROM trips
            WHERE created_at BETWEEN ? AND ?
        `

        const completeQuery = `
            SELECT 
                tr.id,
                tr.name,
                tr.description,
                tr.template_id,
                tr.created_at,
                tr.started_at,
                tr.completed_at,

                rd.id AS ride_id,
                rd.trip_id AS ride_trip_id,
                rd.created_at AS ride_created_at, 
                rd.bus_initial_arrival AS ride_initial_arrival, 
                rd.bus_initial_departure AS ride_initial_departure, 
                rd.bus_final_arrival AS ride_final_arrival,
                rd.sequence_order AS ride_sequence_order,
                rd.notes AS ride_notes,
                rd.vehicle_code AS ride_vehicle_code,

                rt.id AS route_id,
                rt.code AS route_code,
                rt.name AS route_name,
                rt.first_stop_id AS route_first_stop_id,
                rt.last_stop_id AS route_last_stop_id,
                rt.vehicle_type_id as route_vehicle_type_id,

                fs.id AS first_stop_id,
                fs.name AS first_stop_name,
                fs.lat AS first_stop_lat,
                fs.lon AS first_stop_lon,

                ls.id AS last_stop_id,
                ls.name AS last_stop_name,
                ls.lat AS last_stop_lat,
                ls.lon AS last_stop_lon,

                vt.id AS vehicle_type_id,
                vt.name AS vehicle_type_name,

                ic.id AS icon_id,
                ic.name AS icon_name
            FROM trips tr
            JOIN rides rd ON rd.trip_id = tr.id
            JOIN routes rt ON rt.id = rd.route_id
            JOIN stops fs ON fs.id = rd.first_stop_id
            JOIN stops ls ON ls.id = rd.last_stop_id
            JOIN types vt ON vt.id = rt.vehicle_type_id
            JOIN icons ic ON ic.id = vt.icon_id
            WHERE tr.created_at BETWEEN ? AND ?
        `

        try {
            let result = db.executeSync(complete ? completeQuery : query, [start_time, end_time])

            if (complete) {
                const trips = groupTrips(result.rows)
                return trips as CompleteTrip[]
            }

            return result.rows as unknown as Trip[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertTrip = (data: AddableTrip) => {
        try {
            if (data.name && data.created_at) {
                const result = db.executeSync(
                    `INSERT INTO trips (
                        name,
                        created_at,
                        description,
                        template_id,
                        started_at,
                        completed_at
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        data.name,
                        data.created_at,
                        data.description,
                        data.template_id,
                        data.started_at,
                        data.completed_at,
                    ]
                )

                return result
            }
        } catch (e) {
            console.error(e)
        }
    }

    const editTrip = (data: EditableTrip) => {
        try {
            db.executeSync(`
                UPDATE trips SET 
                    name = ?,
                    description = ?,
                    template_id = ?,
                    started_at = ?,
                    completed_at = ?
                    WHERE id = ?    
            `, [
                data.name,
                data.description,
                data.template_id,
                data.started_at,
                data.completed_at,
                data.id
            ])
        } catch (e) {
            console.error(e)
        }
    }

    const deleteTrip = (tripId: number) => {
        try {
            db.executeSync(
                `DELETE FROM trips WHERE id = ${tripId}`
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getTrips()
    }, [])

    return {
        trips,
        getTrips, getTripById,
        getTripsByTimeBetween,
        insertTrip,
        editTrip,
        deleteTrip
    }
}