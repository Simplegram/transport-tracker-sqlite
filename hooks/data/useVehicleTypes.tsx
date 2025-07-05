import { db } from "@/src/services/dataDbService"
import { AddableVehicleType } from "@/src/types/AddableTypes"
import { CompleteVehicleType } from "@/src/types/CompleteTypes"
import { EditableVehicleType } from "@/src/types/EditableTypes"
import { VehicleType } from "@/src/types/Types"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useVehicleTypes() {
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [completeVehicleTypes, setCompleteVehicleTypes] = useState<CompleteVehicleType[]>([])

    const getVehicleTypes = async () => {
        try {
            let result = await db.execute('SELECT * FROM types')

            setVehicleTypes(result.rows as unknown as VehicleType[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCompleteVehicleTypes = async () => {
        try {
            let result = await db.execute(
                `SELECT 
                    ty.id,
                    ty.name, 
                    ic.id AS icon_id,
                    ic.name AS icon_name
                FROM types ty
                JOIN icons ic ON ic.id = ty.icon_id
            `)

            setCompleteVehicleTypes(result.rows as unknown as CompleteVehicleType[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getVehicleTypesById = (id: number) => {
        try {
            let result = db.executeSync('SELECT * FROM types WHERE id = ?', [id])

            return result.rows[0]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertVehicleType = async (data: AddableVehicleType) => {
        try {
            if (data.name && data.icon_id) db.executeSync('INSERT INTO types (name, icon_id) VALUES (?, ?)', [data.name, data.icon_id])
        } catch (e) {
            console.error(e)
        }
    }

    const insertVehicleTypes = async (items: VehicleType[]) => {
        try {
            const data = items.map(item => [item.name, item.icon_id])
            const commands = [
                ['INSERT INTO types (name, icon_id) VALUES (?, ?)', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editVehicleType = async (data: EditableVehicleType) => {
        try {
            db.executeSync('UPDATE types SET name = ?, icon_id = ? WHERE id = ?', [data.name, data.icon_id, data.id])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getVehicleTypes()
        getCompleteVehicleTypes()
    }, [])

    return {
        vehicleTypes, completeVehicleTypes,
        getVehicleTypes, getCompleteVehicleTypes, getVehicleTypesById,
        editVehicleType,
        insertVehicleType, insertVehicleTypes,
    }
}