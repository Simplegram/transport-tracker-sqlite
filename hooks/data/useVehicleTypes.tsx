import { AddableVehicleType } from "@/src/types/AddableTravels"
import { EditableVehicleType } from "@/src/types/EditableTravels"
import { VehicleType } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useVehicleTypes() {
    const { db } = useDatabase()

    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

    const getVehicleTypes = async () => {
        try {
            let result = await db.execute('SELECT * FROM types')

            setVehicleTypes(result.rows)
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

    const editVehicleType = async (data: EditableVehicleType) => {
        try {
            db.executeSync('UPDATE types SET name = ?, icon_id = ? WHERE id = ?', [data.name, data.icon_id, data.id])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getVehicleTypes()
    }, [])

    return {
        vehicleTypes,
        getVehicleTypes, insertVehicleType, editVehicleType
    }
}