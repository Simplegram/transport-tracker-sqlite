import { db } from "@/src/services/dataDbService"
import { AverageTimes, RideDurationData } from "@/src/types/Types"
import { useState } from "react"

interface RideDurationRequest {
    routeId: number
    startStopId: number
    endStopId: number
}

export default function useTravelDetail() {
    const [averageTime, setAverageTime] = useState<AverageTimes>()
    const [rideDurationEstimates, setRideDurationEstimates] = useState<RideDurationData>()

    const diagnostics = `
        WITH RideSequentialLaps AS (
            SELECT
                rd.id as ride_id,
                rd.route_id,
                rd.first_stop_id as ride_first_stop_id,
                rd.last_stop_id as ride_last_stop_id,
                rd.bus_initial_departure,
                rd.bus_final_arrival,
                
                -- Show what we found for initial time
                (SELECT l_start.time FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.stop_id = ?2 ORDER BY datetime(l_start.time, 'utc') ASC LIMIT 1) as lap_initial_raw,
                (SELECT l_start.id FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.stop_id = ?2 ORDER BY datetime(l_start.time, 'utc') ASC LIMIT 1) as lap_initial_id,
                (SELECT l_start.time FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.id = ?2 LIMIT 1) as lap_initial_by_id_raw,
                
                -- Show what we found for final time  
                (SELECT l_end.time FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.stop_id = ?3 ORDER BY datetime(l_end.time, 'utc') ASC LIMIT 1) as lap_final_raw,
                (SELECT l_end.id FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.stop_id = ?3 ORDER BY datetime(l_end.time, 'utc') ASC LIMIT 1) as lap_final_id,
                (SELECT l_end.time FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.id = ?3 LIMIT 1) as lap_final_by_id_raw,
                
                -- Effective times used in calculation (normalized to UTC)
                COALESCE(
                    (SELECT datetime(l_start.time, 'utc') FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.stop_id = ?2 ORDER BY datetime(l_start.time, 'utc') ASC LIMIT 1),
                    (SELECT datetime(l_start.time, 'utc') FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.id = ?2 LIMIT 1),
                    (CASE WHEN rd.first_stop_id = ?2 THEN datetime(rd.bus_initial_departure, 'utc') ELSE NULL END)
                ) as initial_effective_time,
                
                COALESCE(
                    (SELECT datetime(l_end.time, 'utc') FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.stop_id = ?3 ORDER BY datetime(l_end.time, 'utc') ASC LIMIT 1),
                    (SELECT datetime(l_end.time, 'utc') FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.id = ?3 LIMIT 1),
                    (CASE WHEN rd.last_stop_id = ?3 THEN datetime(rd.bus_final_arrival, 'utc') ELSE NULL END)
                ) as final_effective_time,
                
                -- Show which source was used
                CASE 
                    WHEN (SELECT l_start.time FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.stop_id = ?2 ORDER BY datetime(l_start.time, 'utc') ASC LIMIT 1) IS NOT NULL THEN 'lap_by_stop_id'
                    WHEN (SELECT l_start.time FROM laps l_start WHERE l_start.ride_id = rd.id AND l_start.id = ?2 LIMIT 1) IS NOT NULL THEN 'lap_by_lap_id'
                    WHEN rd.first_stop_id = ?2 THEN 'bus_initial_departure'
                    ELSE 'none'
                END as initial_time_source,
                
                CASE 
                    WHEN (SELECT l_end.time FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.stop_id = ?3 ORDER BY datetime(l_end.time, 'utc') ASC LIMIT 1) IS NOT NULL THEN 'lap_by_stop_id'
                    WHEN (SELECT l_end.time FROM laps l_end WHERE l_end.ride_id = rd.id AND l_end.id = ?3 LIMIT 1) IS NOT NULL THEN 'lap_by_lap_id'
                    WHEN rd.last_stop_id = ?3 THEN 'bus_final_arrival'
                    ELSE 'none'
                END as final_time_source
            FROM rides rd
            WHERE rd.route_id = ?1
        ),
        RideWithEffectiveTimes AS (
            SELECT
                *,
                CAST((julianday(final_effective_time) - julianday(initial_effective_time)) * 86400 AS INTEGER) AS ride_duration_seconds,
                ROUND((julianday(final_effective_time) - julianday(initial_effective_time)) * 24, 2) AS ride_duration_hours
            FROM RideSequentialLaps
            WHERE initial_effective_time IS NOT NULL 
            AND final_effective_time IS NOT NULL
            AND julianday(final_effective_time) >= julianday(initial_effective_time)
        ),
        RankedRides AS (
            SELECT
                *,
                ROW_NUMBER() OVER (ORDER BY ride_duration_seconds DESC) as rank_longest,
                ROW_NUMBER() OVER (ORDER BY ride_duration_seconds ASC) as rank_shortest
            FROM RideWithEffectiveTimes
        )
        SELECT
            ride_id,
            initial_effective_time,
            final_effective_time,
            initial_time_source,
            final_time_source,
            lap_initial_id,
            lap_final_id,
            ride_duration_seconds,
            ride_duration_hours,
            rank_longest,
            rank_shortest,
            CASE WHEN rank_longest <= 5 THEN 'TOP_5_LONGEST' ELSE '' END as is_top_5_longest,
            CASE WHEN rank_shortest <= 5 THEN 'TOP_5_SHORTEST' ELSE '' END as is_top_5_shortest
        FROM RankedRides
        ORDER BY ride_duration_seconds DESC;
    `

    const query = `
        WITH RideSequentialLaps AS (
            SELECT
                rd.id as ride_id,
                -- All times already in UTC - no conversion needed
                COALESCE(
                    (SELECT datetime(l_start.time)
                    FROM laps l_start
                    WHERE l_start.ride_id = rd.id
                    AND l_start.stop_id = ?2
                    ORDER BY l_start.time ASC
                    LIMIT 1),
                    (SELECT datetime(l_start.time)
                    FROM laps l_start
                    WHERE l_start.ride_id = rd.id
                    AND l_start.id = ?2
                    LIMIT 1),
                    (CASE WHEN rd.first_stop_id = ?2 THEN datetime(rd.bus_initial_departure) ELSE NULL END)
                ) as initial_effective_time,
                
                COALESCE(
                    (SELECT datetime(l_end.time)
                    FROM laps l_end
                    WHERE l_end.ride_id = rd.id
                    AND l_end.stop_id = ?3
                    ORDER BY l_end.time ASC
                    LIMIT 1),
                    (SELECT datetime(l_end.time)
                    FROM laps l_end
                    WHERE l_end.ride_id = rd.id
                    AND l_end.id = ?3
                    LIMIT 1),
                    (CASE WHEN rd.last_stop_id = ?3 THEN datetime(rd.bus_final_arrival) ELSE NULL END)
                ) as final_effective_time
            FROM rides rd
            WHERE rd.route_id = ?1
        ),
        RankedRides AS (
            SELECT
                CAST((julianday(final_effective_time) - julianday(initial_effective_time)) * 86400 AS INTEGER) AS ride_duration,
                ROW_NUMBER() OVER (ORDER BY (julianday(final_effective_time) - julianday(initial_effective_time)) DESC) as rank_longest,
                ROW_NUMBER() OVER (ORDER BY (julianday(final_effective_time) - julianday(initial_effective_time)) ASC) as rank_shortest
            FROM RideSequentialLaps
            WHERE initial_effective_time IS NOT NULL 
            AND final_effective_time IS NOT NULL
            AND julianday(final_effective_time) >= julianday(initial_effective_time)
        )
        SELECT
            AVG(ride_duration) AS avg_ride_duration,
            AVG(CASE WHEN rank_longest <= 5 THEN ride_duration ELSE NULL END) AS avg_top_5_longest,
            MIN(CASE WHEN rank_longest <= 5 THEN ride_duration ELSE NULL END) AS min_top_5_longest,
            MAX(CASE WHEN rank_longest <= 5 THEN ride_duration ELSE NULL END) AS max_top_5_longest,
            AVG(CASE WHEN rank_shortest <= 5 THEN ride_duration ELSE NULL END) AS avg_top_5_shortest,
            MIN(CASE WHEN rank_shortest <= 5 THEN ride_duration ELSE NULL END) AS min_top_5_shortest,
            MAX(CASE WHEN rank_shortest <= 5 THEN ride_duration ELSE NULL END) AS max_top_5_shortest
        FROM RankedRides;
    `

    const getDurationEstimate = (route_id: number, first_stop_id: number, last_stop_id: number) => {
        const result = db.executeSync(query, [route_id, first_stop_id, last_stop_id])

        return result.rows[0] as unknown as AverageTimes
    }

    const getDurationEstimateSources = (route_id: number, first_stop_id: number, last_stop_id: number) => {
        const result = db.executeSync(diagnostics, [route_id, first_stop_id, last_stop_id])

        return result.rows
    }

    const getAllRideTimes = (items: RideDurationRequest[]) => {
        items.map((item) => {
            const estimates = getDurationEstimate(item.routeId, item.startStopId, item.endStopId)
            setRideDurationEstimates(
                prevDurationEstimates => ({
                    ...prevDurationEstimates,
                    [item.routeId]: estimates
                })
            )
        })
    }

    return {
        averageTime, getDurationEstimate, getDurationEstimateSources,
        rideDurationEstimates, getAllRideTimes,
    }
}