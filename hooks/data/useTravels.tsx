import { db } from "@/src/services/dataDbService"
import { AddableTravel } from "@/src/types/AddableTravels"
import { EditableTravel } from "@/src/types/EditableTravels"
import { Travel } from "@/src/types/Travels"
import { useState } from "react"

export default function useTravels() {
    const [travels, setTravels] = useState<Travel[]>([])

    const getTravels = async () => {
        try {
            let result = await db.execute('SELECT * FROM travels')

            setTravels(result.rows as unknown as Travel[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTravelById = async (id: number) => {
        try {
            let result = db.executeSync('SELECT * FROM travels WHERE id = ?', [id])

            return result.rows
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertTravel = async (data: AddableTravel) => {
        try {
            if (
                data.route_id &&
                data.first_stop_id &&
                data.last_stop_id &&
                data.direction_id &&
                data.vehicle_type_id
            )
                db.executeSync(
                    `INSERT INTO travels (
                        bus_initial_arrival, 
                        bus_initial_departure, 
                        bus_final_arrival, 
                        notes, 
                        vehicle_code, 
                        route_id, 
                        first_stop_id, 
                        last_stop_id, 
                        direction_id, 
                        type_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
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
        } catch (e) {
            console.error(e)
        }
    }

    const editTravel = async (data: EditableTravel) => {
        try {
            db.executeSync(
                `UPDATE travels SET 
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
                    WHERE id = ?`,
                [
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
                ]
            )
        } catch (e) {
            console.error(e)
        }
    }

    return {
        travels,
        getTravels, getTravelById,
        insertTravel, editTravel
    }
}