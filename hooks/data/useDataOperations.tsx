import { db } from "@/src/services/dataDbService"
import { AddableLap, AddableStop } from "@/src/types/AddableTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"

export default function useDataOperations() {
    const addStops = async (data: AddableStop) => {
        try {
            if (data.vehicle_type_ids && data.name) {
                const stop = db.executeSync('INSERT INTO stops (name, name_alt, lat, lon) VALUES (?, ?, ?, ?)', [data.name, data.name_alt, data.lat, data.lon])

                const vehicleTypes = data.vehicle_type_ids.map(item => [stop.insertId, item])
                const commands = [
                    ['INSERT INTO stop_vehicle_types (stop_id, vehicle_type_id) VALUES (?, ?)', vehicleTypes]
                ]

                const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
                console.log(res)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const editStops = async (data: EditableStop) => {
        try {
            let commands: SQLBatchTuple[] = []

            if (data.vehicle_type_ids && data.vehicle_type_ids.length > 0) {
                const vehicleTypes = data.vehicle_type_ids.map(item => [data.id, item])
                commands.push(['INSERT INTO stop_vehicle_types (stop_id, vehicle_type_id) VALUES (?, ?)', vehicleTypes])
            }

            if (data.removed_type_ids && data.removed_type_ids.length > 0) {
                const removedTypes = data.removed_type_ids.map(item => [data.id, item])
                commands.push(['DELETE FROM stop_vehicle_types WHERE stop_id = ? and vehicle_type_id = ?', removedTypes])
            }

            commands.push(['UPDATE stops SET name = ?, name_alt = ?, lat = ?, lon = ? WHERE id = ?', [data.name, data.name_alt, data.lat, data.lon, data.id]])

            const res = await db.executeBatch(commands)
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const addLaps = async (travelId: number, laps: AddableLap[]) => {
        if (laps.length > 0) {
            const newLaps = laps.map(lap => {
                const idedLaps = { ...lap, travel_id: travelId }
                const { id, ...newLap } = idedLaps

                return newLap
            })

            const lapsData = newLaps.map(item => [item.travel_id, item.time, item.note, item.stop_id, item.lat, item.lon])
            const commands = [
                ['INSERT INTO laps (travel_id, time, note, stop_id, lat, lon) VALUES (?, ?, ?, ?, ?, ?)', lapsData]
            ]
            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        }
    }

    return {
        addStops, editStops,
        addLaps
    }
}