import { db } from "@/src/services/dataDbService"
import { AddableStop } from "@/src/types/AddableTravels"
import { CompleteStop } from "@/src/types/CompleteTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { Stop } from "@/src/types/Travels"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useStops() {
    const [stops, setStops] = useState<CompleteStop[]>([])

    const getStops = async () => {
        try {
            let result = await db.execute('SELECT * FROM stops')

            setStops(result.rows as unknown as CompleteStop[])
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
                    st.lon
                FROM stops st
            `)

            setStops(result.rows as unknown as CompleteStop[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertStop = async (data: AddableStop) => {
        try {
            if (data.name) {
                const result = db.executeSync(
                    'INSERT INTO stops (name, name_alt, lat, lon, vehicle_type_id) VALUES (?, ?, ?, ?)',
                    [data.name, data.name_alt, data.lat, data.lon]
                )

                return result
            }
        } catch (e) {
            console.error(e)
        }
    }

    const insertStops = async (items: Stop[]) => {
        try {
            const data = items.map(item => [item.name, item.name_alt, item.lat, item.lon])
            const commands = [
                ['INSERT INTO stops (name, name_alt, lat, lon, vehicle_type_id) VALUES (?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editStop = async (data: EditableStop) => {
        try {
            const statement = db.prepareStatement('UPDATE stops SET name = ?, name_alt = ?, lat = ?, lon = ? WHERE id = ?')

            await statement.bind([data.name, data.name_alt, data.lat, data.lon, data.id])
            await statement.execute()
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