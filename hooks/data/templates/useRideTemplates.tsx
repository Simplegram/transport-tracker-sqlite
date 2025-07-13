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

    const getRideTemplateById = (rideTemplateId: number) => {
        try {
            let result = db.executeSync('SELECT * FROM ride_templates WHERE id = ?', [rideTemplateId])

            return result.rows as unknown as RideTemplate[]
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
            console.error(`Insert error: ${e}`)
        }
    }

    const editRideTemplate = (data: EditableTripTemplate) => {
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

    const editRideTemplates = async (rides: RideTemplate[]) => {
        try {
            const data = rides.map(ride => [ride.sequence_order, ride.route_id, ride.vehicle_type_id, ride.first_stop_id, ride.last_stop_id, ride.notes, ride.id])
            const commands = [
                ['UPDATE ride_templates SET sequence_order = ?, route_id = ?, vehicle_type_id = ?, first_stop_id = ?, last_stop_id = ? WHERE id = ?', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(`Edit error: ${e}`)
        }
    }

    const deleteRideTemplate = (rideTemplateId: number) => {
        try {
            db.executeSync(
                `DELETE FROM ride_templates WHERE id = ${rideTemplateId}`
            )
        } catch (e) {
            console.error(e)
        }
    }

    const deleteRideTemplates = async (rideTemplateIds: number[]) => {
        try {
            const commands = [['DELETE FROM ride_templates WHERE id = ?', rideTemplateIds]]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(`Delete error: ${e}`)
        }
    }

    const modifyRideTemplates = async (newRides: AddableRideTemplate[], changedRides: RideTemplate[], deletedRideIds: number[]) => {
        try {
            const newData = newRides.map(ride => [
                ride.trip_template_id,
                ride.sequence_order,
                ride.route_id,
                ride.vehicle_type_id,
                ride.first_stop_id,
                ride.last_stop_id,
                ride.notes
            ])
            const changedData = changedRides.map(ride => [
                ride.sequence_order,
                ride.route_id,
                ride.vehicle_type_id,
                ride.first_stop_id,
                ride.last_stop_id,
                ride.notes,
                ride.id
            ])

            let commands = []
            if (newRides.length > 0) commands.push([`INSERT INTO ride_templates (
                    trip_template_id, 
                    sequence_order, 
                    route_id, 
                    vehicle_type_id, 
                    first_stop_id, 
                    last_stop_id, 
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`, newData])
            if (changedRides.length > 0) commands.push([`UPDATE ride_templates SET 
                sequence_order = ?, 
                route_id = ?, 
                vehicle_type_id = ?, 
                first_stop_id = ?, 
                last_stop_id = ?,
                notes = ?
                WHERE id = ?`, changedData])
            if (deletedRideIds.length > 0) commands.push(['DELETE FROM ride_templates WHERE id = ?', deletedRideIds])

            if (commands.length > 0) {
                const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
                console.log(res)
            }
        } catch (e) {
            console.error(`Modify error: ${e}`)
        }
    }

    useEffect(() => {
        getRideTemplates()
    }, [])

    return {
        rideTemplates,
        getRideTemplates, getRideTemplateById, getRideTemplatesByTripTemplateId,
        insertRideTemplate, insertRideTemplates,
        editRideTemplate, editRideTemplates,
        deleteRideTemplate, deleteRideTemplates,
        modifyRideTemplates
    }
}