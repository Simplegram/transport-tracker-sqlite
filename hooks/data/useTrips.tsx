import { db } from "@/src/services/dataDbService"
import { AddableTrip } from "@/src/types/AddableTypes"
import { EditableTrip } from "@/src/types/EditableTypes"
import { Trip } from "@/src/types/Types"
import { useEffect, useState } from "react"

export default function useTrips() {
    const [rides, setRides] = useState<Trip[]>([])

    const getTrips = async () => {
        try {
            let result = await db.execute('SELECT * FROM trips')

            setRides(result.rows as unknown as Trip[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertTrip = (data: AddableTrip) => {
        try {
            if (data.name && data.created_at) {
                const result = db.executeSync(
                    `INSERT INTO rides (
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
                UPDATE rides SET 
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
        rides,
        getTrips,
        insertTrip,
        editTrip,
        deleteTrip
    }
}