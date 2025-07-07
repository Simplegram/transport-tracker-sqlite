import { db } from "@/src/services/dataDbService"
import { AddableLapTemplate, LapTemplate } from "@/src/types/data/LapTemplates"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useLapTemplates() {
    const [lapTemplates, setLapTemplates] = useState<LapTemplate[]>([])

    const getLapTemplates = async () => {
        try {
            let result = await db.execute('SELECT * FROM ride_templates')

            setLapTemplates(result.rows as unknown as LapTemplate[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getLapTemplatesByRideTemplateId = (rideTemplateId: number) => {
        try {
            let result = db.executeSync('SELECT * FROM lap_templates WHERE ride_template_id = ?', [rideTemplateId])

            return result.rows as unknown as LapTemplate[]
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertLapTemplate = (data: AddableLapTemplate) => {
        try {
            if (data.ride_template_id && data.sequence_order && data.stop_id) {
                const result = db.executeSync(
                    `INSERT INTO lap_templates (
                        ride_template_id,
                        sequence_order,
                        stop_id,
                        note
                    ) VALUES (?, ?, ?, ?)`,
                    [
                        data.ride_template_id,
                        data.sequence_order,
                        data.stop_id,
                        data.note
                    ]
                )

                return result
            }
        } catch (e) {
            console.error(e)
        }
    }

    const insertLapTemplates = async (items: AddableLapTemplate[]) => {
        try {
            const data = items.map(item => [
                item.ride_template_id,
                item.sequence_order,
                item.stop_id,
                item.note
            ])
            const commands = [
                [`INSERT INTO lap_templates (
                    ride_template_id,
                    sequence_order,
                    stop_id,
                    note
                ) VALUES (?, ?, ?, ?)`, data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getLapTemplates()
    }, [])

    return {
        lapTemplates,
        getLapTemplates, getLapTemplatesByRideTemplateId,
        insertLapTemplate, insertLapTemplates
    }
}