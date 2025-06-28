import { Direction } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useDirections() {
    const { db } = useDatabase()

    const [directions, setDirections] = useState<Direction[]>([])

    const getDirections = async () => {
        try {
            let result = await db.execute('SELECT * FROM directions')

            setDirections(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertDirection = async (data: Direction) => {
        try {
            db.executeSync('INSERT INTO directions (name) VALUES (?)', [data.name])
        } catch (e) {
            console.error(e)
        }
    }

    const editDirection = async (data: Direction) => {
        try {
            db.executeSync('UPDATE directions SET name = ? WHERE id = ?', [data.name, data.id])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getDirections()
    }, [])

    return {
        directions,
        getDirections, insertDirection, editDirection
    }
}