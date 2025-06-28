import { AddableStop } from "@/src/types/AddableTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { Stop } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useStops() {
    const { db } = useDatabase()

    const [stops, setStops] = useState<Stop[]>([])

    const getStops = async () => {
        try {
            let result = await db.execute('SELECT * FROM stops')

            setStops(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertStop = async (data: AddableStop) => {
        try {
            if (data.name && data.vehicle_type_id)
                db.executeSync(
                    'INSERT INTO stops (name, name_alt, lat, lon, vehicle_type_id) VALUES (?, ?, ?, ?, ?)',
                    [data.name, data.name_alt, data.lat, data.lon, data.vehicle_type_id]
                )
        } catch (e) {
            console.error(e)
        }
    }

    const editStop = async (data: EditableStop) => {
        try {
            db.executeSync(
                'UPDATE stops SET name = ?, name_alt = ?, lat = ?, lon = ?, vehicle_type_id = ?, WHERE id = ?',
                [data.name, data.name_alt, data.lat, data.lon, data.vehicle_type_id]
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getStops()
    }, [])

    return {
        stops,
        getStops, insertStop, editStop
    }
}