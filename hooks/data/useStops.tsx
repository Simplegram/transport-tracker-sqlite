import { db } from "@/src/services/dataDbService"
import { AddableStop } from "@/src/types/AddableTravels"
import { CompleteStop, CompleteStopVehicleTypes } from "@/src/types/CompleteTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { Stop } from "@/src/types/Travels"
import { mergeStopVehicleTypesByStopId } from "@/src/utils/dataUtils"
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

    const getCompleteStops = () => {
        try {
            const stops = db.executeSync(
                `SELECT 
                    st.id,
                    st.name, 
                    st.name_alt, 
                    st.lat, 
                    st.lon
                FROM stops st
            `).rows as unknown as Stop[]


            const stopVehicleTypes = db.executeSync(
                `SELECT 
                    svt.stop_id,
                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM stop_vehicle_types svt
                JOIN types vt ON vt.id = svt.vehicle_type_id 
                JOIN icons ic ON ic.id = vt.icon_id`
            ).rows as unknown as CompleteStopVehicleTypes[]
            const mergedStopVehicleTypes = mergeStopVehicleTypesByStopId(stopVehicleTypes)

            const completeData = stops.map(stop => {
                return {
                    ...stop,
                    ...mergedStopVehicleTypes.find(type => type.stop_id === stop.id)
                }
            })

            setStops(completeData as unknown as CompleteStop[])
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