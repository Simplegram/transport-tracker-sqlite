import { db } from "@/src/services/dataDbService"
import { AddableRideTemplate, RideTemplate } from "@/src/types/data/RideTemplates"
import { EditableTripTemplate } from "@/src/types/data/TripTemplates"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useRideTemplates() {
    const [rideTemplates, setRideTemplates] = useState<RideTemplate[]>([])

    const getRideTemplates = async () => {
        try {
            let result = await db.execute('SELECT * FROM ride_templates')

            setRideTemplates(result.rows as unknown as RideTemplate[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getRideTemplatesByTripTemplateId = (tripTemplateId: number) => {
        try {
            let result = db.executeSync('SELECT * FROM ride_templates WHERE trip_template_id = ?', [tripTemplateId])

            return result.rows as unknown as RideTemplate[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertRideTemplate = (data: AddableRideTemplate) => {
        try {
            if (data.trip_template_id && data.sequence_order && data.route_id && data.vehicle_type_id && data.first_stop_id && data.last_stop_id) {
                const result = db.executeSync(
                    `INSERT INTO trip_templates (
                            trip_template_id,
                            sequence_order,
                            route_id,
                            vehicle_type_id,
                            first_stop_id,
                            last_stop_id,
                            estimated_duration,
                            notes
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.trip_template_id,
                        data.sequence_order,
                        data.route_id,
                        data.vehicle_type_id,
                        data.first_stop_id,
                        data.last_stop_id,
                        data.notes
                    ]
                )

                return result
            }
        } catch (e) {
            console.error(e)
        }
    }

    const insertRideTemplates = async (items: AddableRideTemplate[]) => {
        try {
            const data = items.map(item => [
                item.trip_template_id,
                item.sequence_order,
                item.route_id,
                item.vehicle_type_id,
                item.first_stop_id,
                item.last_stop_id,
                item.notes
            ])
            const commands = [
                [`INSERT INTO ride_templates (
                    trip_template_id, 
                    sequence_order, 
                    route_id, 
                    vehicle_type_id, 
                    first_stop_id, 
                    last_stop_id, 
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`, data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editTripTemplate = (data: EditableTripTemplate) => {
        try {
            db.executeSync(`
                UPDATE trip_templates SET 
                    name = ?,
                    description = ?
                    WHERE id = ?    
            `, [
                data.name,
                data.description,
                data.id
            ])
        } catch (e) {
            console.error(e)
        }
    }

    const deleteTripTemplate = (tripTemplateId: number) => {
        try {
            db.executeSync(
                `DELETE FROM trip_templates WHERE id = ${tripTemplateId}`
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getRideTemplates()
    }, [])

    return {
        rideTemplates,
        getRideTemplates, getRideTemplatesByTripTemplateId,
        insertRideTemplate, insertRideTemplates,
        editTripTemplate,
        deleteTripTemplate
    }
}