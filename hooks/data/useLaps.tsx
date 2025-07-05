import { ManageableLap } from "@/components/modal/FlatlistPicker"
import { db } from "@/src/services/dataDbService"
import { AddableLap } from "@/src/types/AddableTypes"
import { CompleteLap } from "@/src/types/CompleteTypes"
import { EditableLap } from "@/src/types/EditableTypes"
import { groupLapsWithStop } from "@/src/utils/groupingUtils"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import { useEffect, useState } from "react"

export default function useLaps() {
    const [laps, setLaps] = useState<ManageableLap[]>([])
    const [completeLaps, setCompleteLaps] = useState<CompleteLap[]>([])

    const getLaps = async () => {
        try {
            let result = await db.execute('SELECT * FROM laps')

            setLaps(result.rows as unknown as ManageableLap[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getLapsByTravelId = async (travelId: number) => {
        try {
            const [lapsResult] = await Promise.all([
                db.execute('SELECT * FROM laps WHERE ride_id = ?', [travelId])
            ])

            setLaps(lapsResult.rows as unknown as ManageableLap[])
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const getLapsByTravelIds = async (travelIds: number[]) => {
        try {
            const ids = travelIds.join(', ')
            const query = `SELECT 
                    lap.id,
                    lap.ride_id,
                    lap.time,
                    lap.lat,
                    lap.lon,
                    lap.note,
                    st.id AS stop_id,
                    st.name AS stop_name,
                    st.lat AS stop_lat,
                    st.lon AS stop_lon,
                    st.name_alt AS stop_name_alt
                FROM laps lap 
                LEFT JOIN stops st ON st.id = lap.stop_id
                WHERE lap.ride_id IN (${ids})
            `
            let result = await db.execute(query)

            const completeLaps = groupLapsWithStop(result.rows)
            setCompleteLaps(completeLaps)
        } catch (e) {
            console.error(`Database Error: ${e}`)
        }
    }

    const insertLaps = async (laps: AddableLap[]) => {
        try {
            const data = laps.map(lap => [lap.ride_id, lap.time, lap.note, lap.stop_id, lap.lat, lap.lon])
            const commands = [
                ['INSERT INTO laps (ride_id, time, note, stop_id, lat, lon) VALUES (?, ?, ?, ?, ?, ?)', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const editLaps = async (laps: EditableLap[]) => {
        try {
            const data = laps.map(lap => [lap.ride_id, lap.time, lap.note, lap.stop_id, lap.lat, lap.lon, lap.id])
            const commands = [
                ['UPDATE laps SET ride_id = ?, time = ?, note = ?, stop_id = ?, lat = ?, lon = ? WHERE id = ?', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    const deleteLaps = async (lapIds: number[]) => {
        try {
            const data = lapIds.map(id => [id])
            const commands = [
                ['DELETE FROM laps WHERE id = ?', data]
            ]

            const res = await db.executeBatch(commands as unknown as SQLBatchTuple[])
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getLaps()
    }, [])

    return {
        laps, completeLaps,
        setLaps,
        getLaps, getLapsByTravelId, getLapsByTravelIds,
        insertLaps, editLaps, deleteLaps
    }
}