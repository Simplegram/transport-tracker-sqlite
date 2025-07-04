import { db } from "@/src/services/dataDbService"
import { AverageTimes, TravelTimeData } from "@/src/types/Travels"
import { useState } from "react"

interface TravelTimeInput {
    routeId: number
    directionId: number
    startStopId: number
    endStopId: number
}

export default function useTravelDetail() {
    const [averageTime, setAverageTime] = useState<AverageTimes>()
    const [travelTimes, setTravelTimes] = useState<TravelTimeData>()

    const getTravelEstimate = (route_id: number, direction_id: number, first_stop_id: number, last_stop_id: number) => {
        const result = db.executeSync(`
            -- SQLite version of the travel duration analysis query
            -- Parameters: ?1 = route_id, ?2 = direction_id, ?3 = first_stop_id, ?4 = last_stop_id

            WITH TravelEffectiveTimes AS (
                SELECT
                    t.id as travel_id,
                    -- Find the earliest time for the requested first_stop_id in laps
                    (SELECT l_start.time
                    FROM laps l_start
                    WHERE l_start.travel_id = t.id
                    AND l_start.stop_id = ?3  -- first_stop_id_param
                    ORDER BY l_start.time ASC
                    LIMIT 1
                    ) as lap_initial_time,
                    -- Fallback to bus_initial_departure if conditions are met
                    (CASE WHEN t.first_stop_id = ?3 THEN t.bus_initial_departure ELSE NULL END) as fallback_initial_time,

                    -- Find the latest time for the requested last_stop_id in laps
                    (SELECT l_end.time
                    FROM laps l_end
                    WHERE l_end.travel_id = t.id
                    AND l_end.stop_id = ?4  -- last_stop_id_param
                    ORDER BY l_end.time DESC
                    LIMIT 1
                    ) as lap_final_time,
                    -- Fallback to bus_final_arrival if conditions are met
                    (CASE WHEN t.last_stop_id = ?4 THEN t.bus_final_arrival ELSE NULL END) as fallback_final_time
                FROM travels t
                WHERE t.route_id = ?1  -- route_id_param
                AND t.direction_id = ?2  -- direction_id_param
            ),
            TravelWithEffectiveTimes AS (
                SELECT
                    travel_id,
                    COALESCE(lap_initial_time, fallback_initial_time) as initial_effective_time,
                    COALESCE(lap_final_time, fallback_final_time) as final_effective_time
                FROM TravelEffectiveTimes
            ),
            RankedTravels AS (
                SELECT
                    -- SQLite uses julianday() for date arithmetic, result is in days, multiply by 86400 for seconds
                    CAST((julianday(final_effective_time) - julianday(initial_effective_time)) * 86400 AS INTEGER) AS travel_duration,
                    ROW_NUMBER() OVER (ORDER BY (julianday(final_effective_time) - julianday(initial_effective_time)) DESC) as rank_longest,
                    ROW_NUMBER() OVER (ORDER BY (julianday(final_effective_time) - julianday(initial_effective_time)) ASC) as rank_shortest
                FROM TravelWithEffectiveTimes
                WHERE initial_effective_time IS NOT NULL 
                AND final_effective_time IS NOT NULL
                AND julianday(final_effective_time) >= julianday(initial_effective_time) -- Ensure duration is non-negative
            )
            SELECT
                AVG(travel_duration) AS avg_travel_time,

                AVG(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS avg_top_5_longest,
                MIN(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS min_top_5_longest,
                MAX(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS max_top_5_longest,

                AVG(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS avg_top_5_shortest,
                MIN(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS min_top_5_shortest,
                MAX(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS max_top_5_shortest
            FROM RankedTravels;  
        `, [route_id, direction_id, first_stop_id, last_stop_id])

        setAverageTime(result.rows[0])

        return result.rows
    }

    const getAllTravelTimes = (items: TravelTimeInput[]) => {
        items.map((item) => {
            const estimates = getTravelEstimate(item.routeId, item.directionId, item.startStopId, item.endStopId)
            estimates.map(estimate => {
                setTravelTimes(
                    prevTravelTimes => ({
                        ...prevTravelTimes,
                        [item.routeId]: {
                            ...estimate
                        }
                    })
                )
            })
        })
    }

    return {
        averageTime, getTravelEstimate,
        travelTimes, getAllTravelTimes,
    }
}