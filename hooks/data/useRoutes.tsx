import { db } from "@/src/services/dataDbService"
import { AddableRoute } from "@/src/types/AddableTravels"
import { CompleteRoute } from "@/src/types/CompleteTravels"
import { EditableRoute } from "@/src/types/EditableTravels"
import { Route } from "@/src/types/Travels"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useRoutes() {
    const [routes, setRoutes] = useState<CompleteRoute[]>([])

    const getRoutes = async () => {
        try {
            let result = await db.execute('SELECT * FROM routes')

            setRoutes(result.rows as unknown as CompleteRoute[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getCompleteRoutes = async () => {
        try {
            let result = await db.execute(
                `SELECT 
                    rt.id,
                    rt.code, 
                    rt.name, 
                    rt.first_stop_id, 
                    rt.last_stop_id
                FROM routes rt
            `)
            // let result = await db.execute(
            //     `SELECT 
            //         rt.id,
            //         rt.code, 
            //         rt.name, 
            //         rt.first_stop_id, 
            //         rt.last_stop_id,
            //         vt.id AS vehicle_type_id,
            //         vt.name AS vehicle_type_name,
            //         ic.id AS icon_id,
            //         ic.name AS icon_name
            //     FROM routes rt
            //     JOIN types vt ON vt.id = rt.vehicle_type_id 
            //     JOIN icons ic ON ic.id = vt.icon_id
            // `)

            setRoutes(result.rows as unknown as CompleteRoute[])
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

    const insertRoutes = async (items: Route[]) => {
        try {
            const data = items.map(item => [item.code, item.name, item.first_stop_id, item.last_stop_id, item.vehicle_type_id])
            const commands = [
                ['INSERT INTO routes (code, name, first_stop_id, last_stop_id, vehicle_type_id) VALUES (?, ?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editRoute = async (data: EditableRoute) => {
        try {
            db.executeSync(
                'UPDATE routes SET code = ?, name = ?, first_stop_id = ?, last_stop_id = ?, vehicle_type_id = ? WHERE id = ?',
                [data.code, data.name, data.first_stop_id, data.last_stop_id, data.vehicle_type_id, data.id]
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getCompleteRoutes()
    }, [])

    return {
        routes,
        getRoutes, getCompleteRoutes,
        editRoute,
        insertRoute, insertRoutes
    }
}