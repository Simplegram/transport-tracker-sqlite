import { db } from "@/src/services/dataDbService"
import { AddableTripTemplate, EditableTripTemplate, TripTemplate } from "@/src/types/data/TripTemplates"
import { useEffect, useState } from "react"

export default function useTripTemplates() {
    const [tripTemplates, setTripTemplates] = useState<TripTemplate[]>([])

    const getTripTemplates = async () => {
        try {
            let result = await db.execute('SELECT * FROM trip_templates')

            setTripTemplates(result.rows as unknown as TripTemplate[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getTripTemplateById = (tripTemplateId: number) => {
        try {
            let result = db.executeSync('SELECT * FROM trip_templates WHERE id = ?', [tripTemplateId])

            return result.rows[0] as unknown as TripTemplate
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertTripTemplate = (data: AddableTripTemplate) => {
        try {
            if (data.name && data.created_at) {
                const result = db.executeSync(
                    `INSERT INTO trip_templates (
                        name,
                        created_at,
                        description
                    ) VALUES (?, ?, ?)`,
                    [
                        data.name,
                        data.created_at,
                        data.description
                    ]
                )

                return result
            }
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
        getTripTemplates()
    }, [])

    return {
        tripTemplates,
        getTripTemplates, getTripTemplateById,
        insertTripTemplate,
        editTripTemplate,
        deleteTripTemplate
    }
}