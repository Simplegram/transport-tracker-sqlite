import { AddableLap } from "@/src/types/AddableTravels"
import { EditableLap } from "@/src/types/EditableTravels"
import { Lap } from "@/src/types/Travels"
import { useState } from "react"
import useDatabase from "../useDatabase"

export default function useLaps() {
    const { db } = useDatabase()

    const [laps, setLaps] = useState<Lap[]>([])

    const getLaps = async () => {
        try {
            let result = await db.execute('SELECT * FROM stops')

            setLaps(result.rows)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getLapsByTravelId = async (travelId: number) => {
        try {
            let result = db.executeSync('SELECT * FROM laps WHERE travel_id = ?', [travelId])

            return result.rows
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertLaps = async (laps: AddableLap[]) => {
        try {
            const data = laps.map(lap => [lap.travel_id, lap.time, lap.note, lap.stop_id, lap.lat, lap.lon])
            const commands = [
                ['INSERT INTO laps (travel_id, time, note, stop_id, lat, lon) VALUES (?, ?, ?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands)
        } catch (e) {
            console.error(e)
        }
    }

    const editLaps = async (laps: EditableLap[]) => {
        try {
            const data = laps.map(lap => [lap.travel_id, lap.time, lap.note, lap.stop_id, lap.lat, lap.lon])
            const commands = [
                ['INSERT INTO laps (travel_id, time, note, stop_id, lat, lon) VALUES (?, ?, ?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        laps,
        getLaps, getLapsByTravelId,
        insertLaps
    }
}