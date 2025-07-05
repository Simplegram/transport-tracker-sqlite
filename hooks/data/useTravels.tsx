import { db } from "@/src/services/dataDbService"
import { AddableTravel } from "@/src/types/AddableTravels"
import { CompleteTravel } from "@/src/types/CompleteTravels"
import { EditableTravel } from "@/src/types/EditableTravels"
import { Ride } from "@/src/types/Travels"
import { groupTravels } from "@/src/utils/groupingUtils"
import { useEffect, useState } from "react"

export default function useTravels() {
    const [travels, setTravels] = useState<Ride[]>([])
    const [completeTravels, setCompleteTravels] = useState<CompleteTravel[]>([])

    const getTravels = async () => {
        try {
            let result = await db.execute('SELECT * FROM rides')

            setTravels(result.rows as unknown as Ride[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCompleteTravels = async () => {
        try {
            let result = await db.execute(`
                SELECT 
                    rd.id,
                    rd.created_at, 
                    rd.bus_initial_arrival, 
                    rd.bus_initial_departure, 
                    rd.bus_final_arrival,
                    rd.notes,
                    rd.vehicle_code,

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

                    dr.id AS direction_id,
                    dr.name AS direction_name,

                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,

                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM rides rd
                JOIN routes rt ON rt.id = rd.route_id
                JOIN stops fs ON fs.id = rd.first_stop_id
                JOIN stops ls ON ls.id = rd.last_stop_id
                JOIN directions dr ON dr.id = rd.direction_id
                JOIN types vt ON vt.id = rt.vehicle_type_id
                JOIN icons ic ON ic.id = vt.icon_id
            `,)

            const completeTravelData = groupTravels(result.rows)
            setCompleteTravels(completeTravelData)

            setCompleteTravels(result.rows as unknown as CompleteTravel[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTravelById = async (id: number) => {
        try {
            let result = db.executeSync('SELECT * FROM rides WHERE id = ?', [id])

            return result.rows
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTravelsByTimeBetween = async (start_time: string, end_time: string) => {
        try {
            let result = await db.execute(`
                SELECT 
                    rd.id,
                    rd.created_at, 
                    rd.bus_initial_arrival, 
                    rd.bus_initial_departure, 
                    rd.bus_final_arrival,
                    rd.notes,
                    rd.vehicle_code,

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

                    dr.id AS direction_id,
                    dr.name AS direction_name,

                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,

                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM rides rd
                JOIN routes rt ON rt.id = rd.route_id
                JOIN stops fs ON fs.id = rd.first_stop_id
                JOIN stops ls ON ls.id = rd.last_stop_id
                JOIN directions dr ON dr.id = rd.direction_id
                JOIN types vt ON vt.id = rt.vehicle_type_id
                JOIN icons ic ON ic.id = vt.icon_id
                WHERE created_at BETWEEN ? AND ?    
            `, [start_time, end_time])

            const completeTravelData = groupTravels(result.rows)
            setCompleteTravels(completeTravelData)

            return travels
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCreatedAts = () => {
        try {
            let result = db.executeSync('SELECT created_at FROM rides')
            const createdAts = result.rows.map(row => row.created_at)

            return createdAts as unknown as string[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertTravel = (data: AddableTravel) => {
        try {
            if (
                data.created_at &&
                data.route_id &&
                data.first_stop_id &&
                data.last_stop_id &&
                data.direction_id &&
                data.vehicle_type_id
            ) {
                const result = db.executeSync(
                    `INSERT INTO rides (
                        created_at,
                        bus_initial_arrival, 
                        bus_initial_departure, 
                        bus_final_arrival, 
                        notes, 
                        vehicle_code, 
                        route_id, 
                        first_stop_id, 
                        last_stop_id, 
                        direction_id, 
                        vehicle_type_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.created_at,
                        data.bus_initial_arrival,
                        data.bus_initial_departure,
                        data.bus_final_arrival,
                        data.notes,
                        data.vehicle_code,
                        data.route_id,
                        data.first_stop_id,
                        data.last_stop_id,
                        data.direction_id,
                        data.vehicle_type_id
                    ]
                )

                return result
            }
        } catch (e) {
            console.error(e)
        }
    }

    const editTravel = (data: EditableTravel) => {
        try {
            db.executeSync(`
                UPDATE rides SET 
                    bus_initial_arrival = ?,
                    bus_initial_departure = ?,
                    bus_final_arrival = ?,
                    notes = ?,
                    vehicle_code = ?,
                    route_id = ?,
                    first_stop_id = ?,
                    last_stop_id = ?,
                    direction_id = ?,
                    vehicle_type_id = ?
                    WHERE id = ?    
            `, [
                data.bus_initial_arrival,
                data.bus_initial_departure,
                data.bus_final_arrival,
                data.notes,
                data.vehicle_code,
                data.route_id,
                data.first_stop_id,
                data.last_stop_id,
                data.direction_id,
                data.vehicle_type_id,
                data.id
            ])
        } catch (e) {
            console.error(e)
        }
    }

    const deleteAllTravels = () => {
        try {
            db.executeSync(
                `DELETE FROM rides`
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getTravels()
        getCompleteTravels()
    }, [])

    return {
        travels, completeTravels,
        getTravels, getTravelById,
        insertTravel, editTravel,
        deleteAllTravels,
        getTravelsByTimeBetween, getCreatedAts
    }
}