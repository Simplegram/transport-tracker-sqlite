import { AddableVehicleType } from "@/src/types/AddableTravels"
import { CompleteVehicleType } from "@/src/types/CompleteTravels"
import { EditableVehicleType } from "@/src/types/EditableTravels"
import { VehicleType } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useVehicleTypes() {
    const { db } = useDatabase()

    const [vehicleTypes, setVehicleTypes] = useState<CompleteVehicleType[]>([])

    const getVehicleTypes = async () => {
        try {
            let result = await db.execute('SELECT * FROM types')

            setVehicleTypes(result.rows)
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

            setVehicleTypes(result.rows)
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

            const res = await db.executeBatch(commands)
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
        getCompleteVehicleTypes()
    }, [])

    return {
        vehicleTypes,
        getVehicleTypes, getCompleteVehicleTypes, getVehicleTypesById,
        editVehicleType,
        insertVehicleType, insertVehicleTypes,
    }
}