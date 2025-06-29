import { AddableIconType } from "@/src/types/AddableTravels"
import { IconType } from "@/src/types/Travels"
import { useEffect, useState } from "react"
import useDatabase from "../useDatabase"

export default function useIcons() {
    const { db } = useDatabase()

    const [icons, setIcons] = useState<IconType[]>([])

    const getIcons = async () => {
        try {
            let result = await db.execute('SELECT * FROM icons')

            setIcons(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getIconById = (id: number) => {
        try {
            let result = db.executeSync('SELECT * FROM icons WHERE id = ?', [id])

            return result.rows[0]
        } catch (e) {
            console.error(e)
        }
    }

    const insertIcon = async (data: AddableIconType) => {
        try {
            if (data.name) db.executeSync('INSERT INTO icons (name) VALUES (?)', [data.name])
        } catch (e) {
            console.error(e)
        }
    }

    const insertIcons = async (items: IconType[]) => {
        try {
            const data = items.map(item => [item.name])
            const commands = [
                ['INSERT INTO icons (name) VALUES (?)', data]
            ]

            const res = await db.executeBatch(commands)
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editIcon = async (data: IconType) => {
        try {
            db.executeSync('UPDATE icons SET name = ? WHERE id = ?', [data.name, data.id])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getIcons()
    }, [])

    return {
        icons,
        getIcons, editIcon,
        insertIcon, insertIcons,
        getIconById
    }
}