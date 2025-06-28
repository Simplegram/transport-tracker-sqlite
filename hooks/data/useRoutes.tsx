import { AddableRoute } from "@/src/types/AddableTravels"
import { EditableRoute } from "@/src/types/EditableTravels"
import { Route } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useRoutes() {
    const { db } = useDatabase()

    const [routes, setRoutes] = useState<Route[]>([])

    const getRoutes = async () => {
        try {
            let result = await db.execute('SELECT * FROM routes')

            setRoutes(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertRoute = async (data: AddableRoute) => {
        try {
            if (data.code && data.name && data.first_stop_id && data.last_stop_id && data.vehicle_type_id)
                db.executeSync(
                    'INSERT INTO routes (code, name, first_stop_id, last_stop_id, vehicle_type_id) VALUES (?, ?, ?, ?, ?)',
                    [data.code, data.name, data.first_stop_id, data.last_stop_id, data.vehicle_type_id]
                )
        } catch (e) {
            console.error(e)
        }
    }

    const editRoute = async (data: EditableRoute) => {
        try {
            db.executeSync(
                'UPDATE routes SET code = ?, name = ?, first_stop_id = ?, last_stop_id = ?, vehicle_type_id = ?, WHERE id = ?',
                [data.code, data.name, data.first_stop_id, data.last_stop_id, data.vehicle_type_id, data.id]
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getRoutes()
    }, [])

    return {
        routes,
        getRoutes, insertRoute, editRoute
    }
}