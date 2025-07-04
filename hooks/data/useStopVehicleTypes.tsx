import { db } from "@/src/services/dataDbService"
import { AddableStop } from "@/src/types/AddableTravels"
import { CompleteStopVehicleTypes } from "@/src/types/CompleteTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { StopVehicleType } from "@/src/types/Travels"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useStopsVehicleTypes() {
    const [stopVehicleTypes, setStopVehicleTypes] = useState<StopVehicleType[]>([])
    const [completeStopVehicleTypes, setCompleteStopVehicleTypes] = useState<CompleteStopVehicleTypes[]>([])

    const getStopVehicleTypes = async () => {
        try {
            let result = await db.execute(
                `SELECT * FROM stop_vehicle_types`
            )

            setStopVehicleTypes(result.rows as unknown as StopVehicleType[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCompleteStopVehicleTypes = async () => {
        try {
            let result = await db.execute(
                `SELECT 
                    svt.stop_id,
                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM stop_vehicle_types svt
                JOIN types vt ON vt.id = svt.vehicle_type_id 
                JOIN icons ic ON ic.id = vt.icon_id`
            )

            setCompleteStopVehicleTypes(result.rows as unknown as CompleteStopVehicleTypes[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getStopVehicleTypesById = (stopId: number) => {
        try {
            let result = db.executeSync(
                `SELECT 
                    svt.stop_id,
                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM stop_vehicle_types svt
                JOIN types vt ON vt.id = svt.vehicle_type_id 
                JOIN icons ic ON ic.id = vt.icon_id
                WHERE stop_id = ?`, [stopId])

            return result.rows as unknown as CompleteStopVehicleTypes[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getStopVehicleTypesByVehicleTypeId = (vehicleTypeId: number) => {
        try {
            let result = db.executeSync(
                `SELECT 
                    svt.stop_id,
                    vt.id AS vehicle_type_id,
                    vt.name AS vehicle_type_name,
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM stop_vehicle_types svt
                JOIN types vt ON vt.id = svt.vehicle_type_id 
                JOIN icons ic ON ic.id = vt.icon_id
                WHERE vehicle_type_id = ?`, [vehicleTypeId])

            return result.rows as unknown as CompleteStopVehicleTypes[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertStopVehicleType = async (data: StopVehicleType) => {
        await db.transaction(async (tx) => {
            const { status } = await tx.execute(
                'UPDATE sometable SET somecolumn = ? where somekey = ?',
                [0, 1]
            )

            // Any uncatched error ROLLBACK transaction
            throw new Error('Random Error!')

        })
    }

    const insertStopVehicleTypes = async (data: AddableStop) => {
        try {
            let commands: SQLBatchTuple[] = []

            if (data.vehicle_type_ids) {
                const vehicleTypes = data.vehicle_type_ids.map(item => [item])
                commands.push(['INSERT INTO stop_vehicle_types (stop_id, vehicle_type_id) VALUES (?, ?)', vehicleTypes])
            }
        } catch (e) {
            console.error(e)
        }
    }

    const editStopVehicleTypes = async (data: EditableStop) => {
        try {
            let commands: SQLBatchTuple[] = []

            if (data.vehicle_type_ids) {
                const vehicleTypes = data.vehicle_type_ids.map(item => [data.id, item])
                commands.push(['INSERT INTO stop_vehicle_types (stop_id, vehicle_type_id) VALUES (?, ?)', vehicleTypes])
            }

            if (data.removed_type_ids) {
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

    const deleteStopVehicleTypes = async (items: StopVehicleType[]) => {
        try {
            const statement = db.prepareStatement('DELETE FROM stop_vehicle_types WHERE stop_id = ? and vehicle_type_id = ?')
            const data = items.map(item => [item.stop_id, item.vehicle_type_id])

            for (let i = 0; i < data.length; i++) {
                await statement.bind(data[i])
                let result = await statement.execute()
                console.log(result)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getStopVehicleTypes()
        getCompleteStopVehicleTypes()
    }, [])

    return {
        stopVehicleTypes, completeStopVehicleTypes,
        getStopVehicleTypes, getCompleteStopVehicleTypes,
        editStopVehicleTypes,
        insertStopVehicleType, insertStopVehicleTypes,
        deleteStopVehicleTypes,
        getStopVehicleTypesByVehicleTypeId, getStopVehicleTypesById
    }
}