import { db } from "@/src/services/dataDbService"
import { Direction } from "@/src/types/Types"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useDirections() {
    const [directions, setDirections] = useState<Direction[]>([])

    const getDirections = async () => {
        try {
            let result = await db.execute('SELECT * FROM directions')

            setDirections(result.rows as unknown as Direction[])
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

    const insertDirections = async (items: Direction[]) => {
        try {
            const data = items.map(item => [item.name])
            const commands = [
                ['INSERT INTO directions (name) VALUES (?)', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
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

    const deleteDirection = (directionId: number) => {
        try {
            db.executeSync(
                `DELETE FROM directions WHERE id = ${directionId}`
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getDirections()
    }, [])

    return {
        directions,
        getDirections, editDirection,
        insertDirection, insertDirections,
        deleteDirection
    }
}