import { AddableStop } from "@/src/types/AddableTravels"
import { CompleteStop } from "@/src/types/CompleteTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { Stop } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useStops() {
    const { db } = useDatabase()

    const [stops, setStops] = useState<CompleteStop[]>([])

    const getStops = async () => {
        try {
            let result = await db.execute('SELECT * FROM stops')

            setStops(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCompleteStops = async () => {
        try {
            let result = await db.execute(
                `SELECT 
                    st.id,
                    st.name, 
                    st.name_alt, 
                    st.lat, 
                    st.lon,
                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM stops st
                JOIN types vt ON vt.id = st.vehicle_type_id 
                JOIN icons ic ON ic.id = vt.icon_id
            `)

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

    const insertStops = async (items: Stop[]) => {
        try {
            const data = items.map(item => [item.name, item.name_alt, item.lat, item.lon, item.vehicle_type_id])
            const commands = [
                ['INSERT INTO stops (name, name_alt, lat, lon, vehicle_type_id) VALUES (?, ?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands)
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editStop = async (data: EditableStop) => {
        try {
            db.executeSync(
                'UPDATE stops SET name = ?, name_alt = ?, lat = ?, lon = ?, vehicle_type_id = ? WHERE id = ?',
                [data.name, data.name_alt, data.lat, data.lon, data.vehicle_type_id, data.id]
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getCompleteStops()
    }, [])

    return {
        stops,
        getCompleteStops, getStops,
        editStop,
        insertStop, insertStops
    }
}