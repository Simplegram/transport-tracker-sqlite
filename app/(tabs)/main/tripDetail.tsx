import AnnotationContent from '@/components/AnnotationContent'
import TypeButton from '@/components/button/TypeButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Container from '@/components/Container'
import Input from '@/components/input/Input'
import LoadingScreen from '@/components/LoadingScreen'
import MapDisplay from '@/components/MapDisplay'
import RideDetailCard from '@/components/ride/RideDetailCard'
import { useTheme } from '@/context/ThemeContext'
import { useTripContext } from '@/context/TripContext'
import useLaps from '@/hooks/data/useLaps'
import useRides from '@/hooks/data/useRides'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import useTravelDetail from '@/hooks/useTravelDetail'
import { colors } from '@/src/const/color'
import { travelDetailStyles } from '@/src/styles/TravelDetailStyles'
import { CompleteRide } from '@/src/types/CompleteTypes'
import { Stop } from '@/src/types/Types'
import { formatMsToMinutes, sumTimesToMs, utcToLocaltime } from '@/src/utils/dateUtils'
import { getSimpleCentroid } from '@/src/utils/mapUtils'
import { MarkerView } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'

const { width: screenWidth } = Dimensions.get("screen")

interface LapLatLon {
    id: string
    stop: Stop | null
    name: string | undefined
    coords: number[]
    time: string
}

const typeIndex = {
    best: 'min_top_5_shortest',
    average: 'avg_ride_duration',
    worst: 'max_top_5_longest'
}

export default function TripDetail() {
    const { theme } = useTheme()

    const { currentTrip } = useTripContext()

    const { getCompleteRidesByTripId } = useRides()
    const { completeVehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()
    const { completeLaps: currentRidesLaps, getLaps, getLapsByRideIds } = useLaps()

    const refetchTravelData = () => {
        getLaps()
        getCompleteVehicleTypes()
    }
    const { rideDurationEstimates, getAllRideTimes } = useTravelDetail()

    const [tripRides, setTripRides] = useState<CompleteRide[]>([])
    const [type, setType] = useState<'best' | 'average' | 'worst'>('average')

    if (!tripRides || !currentTrip) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    useEffect(() => {
        if (currentTrip) {
            const tripRides = getCompleteRidesByTripId(currentTrip.id)
            if (tripRides) {
                setTripRides(tripRides)

                const allLaps = tripRides.map(ride => ride.id)
                getLapsByRideIds(allLaps)

                const inputItems = tripRides.map((ride) => {
                    return {
                        routeId: ride.route.id,
                        startStopId: ride.first_stop.id,
                        endStopId: ride.last_stop.id
                    }
                })
                getAllRideTimes(inputItems)
            }
        }
    }, [currentTrip])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()
        }, [])
    )

    if (!rideDurationEstimates) return (
        <LoadingScreen />
    )

    const sortedData = [...tripRides].sort((a, b) => {
        const dateAInitialArrival = a.bus_initial_arrival ? new Date(a.bus_initial_arrival).getTime() : a.bus_initial_departure ? new Date(a.bus_initial_departure).getTime() : null
        const dateBInitialArrival = b.bus_initial_arrival ? new Date(b.bus_initial_arrival).getTime() : b.bus_initial_departure ? new Date(b.bus_initial_departure).getTime() : null

        if (dateAInitialArrival !== null && dateBInitialArrival !== null) {
            return dateAInitialArrival - dateBInitialArrival
        }

        const dateACreatedAt = new Date(a.created_at).getTime()
        const dateBCreatedAt = new Date(b.created_at).getTime()

        return dateACreatedAt - dateBCreatedAt
    })

    const stopLatLon = sortedData.flatMap(ride => {
        const coords = []

        if (ride.first_stop && ride.first_stop.lat && ride.first_stop.lon) {
            coords.push(
                {
                    id: "stop",
                    stop: ride.first_stop.id,
                    name: ride.first_stop.name,
                    coords: [ride.first_stop.lon, ride.first_stop.lat],
                    time: ride.bus_initial_arrival || ride.bus_initial_departure || null
                }
            )
        }

        if (ride.last_stop && ride.last_stop.lat && ride.last_stop.lon) {
            coords.push(
                {
                    id: "stop",
                    stop: ride.last_stop,
                    name: ride.last_stop.name,
                    coords: [ride.last_stop.lon, ride.last_stop.lat],
                    time: ride.bus_final_arrival || null
                }
            )
        }

        return coords
    })

    let lapLatLon: LapLatLon[] = []
    if (currentRidesLaps)
        lapLatLon = currentRidesLaps
            .filter(lap => (lap.stop.id !== null && lap.stop.lon && lap.stop.lat) || (lap.lon && lap.lat))
            .map(lap => {
                let coords: number[]
                if (lap.stop && lap.stop.lon && lap.stop.lat) {
                    coords = [lap.stop.lon, lap.stop.lat]
                }
                else if (lap.lon && lap.lat) coords = [lap.lon, lap.lat]
                else coords = []

                return {
                    id: "lap",
                    stop: lap.stop,
                    name: lap.stop.name,
                    coords: coords,
                    time: lap.time!,
                }
            })

    const fullLatLon = [...stopLatLon, ...lapLatLon]

    const validCoords = fullLatLon
        .map(data => data?.coords)
        .filter((coords): coords is number[] => coords !== undefined && coords !== null)

    const centerLatLon = getSimpleCentroid(validCoords)

    const mappedRideDurationEstimates = Object.values(rideDurationEstimates).map(
        (timeData) => timeData[typeIndex[type]]
    )

    const extractedTimes = Object.keys(rideDurationEstimates).reduce((acc, routeId) => {
        const timeData = rideDurationEstimates[routeId]
        const selectedTime = timeData[typeIndex[type]]

        acc[routeId] = selectedTime

        return acc
    }, {} as { [key: string]: any })

    const cleanRideDurationEstimates = mappedRideDurationEstimates.filter(time => time !== null)
    let rideDurationEstimateMs = 0
    if (cleanRideDurationEstimates.length > 0)
        rideDurationEstimateMs = sumTimesToMs(cleanRideDurationEstimates)

    let onRoadDurationMs = 0, onRoadDurationStatus = ''
    sortedData.forEach((ride, index) => {
        try {
            const departureDate = moment(ride.bus_initial_departure)

            let finalArrivalDate = moment(null)
            if (currentRidesLaps) {
                const rideLaps = currentRidesLaps.filter(lap => lap.ride_id === ride.id)
                const lastLap = rideLaps[rideLaps.length - 1]
                if (lastLap || typeof (lastLap) !== 'undefined') {
                    finalArrivalDate = moment(lastLap.time)
                    onRoadDurationStatus = '(to last lap)'
                }
            }
            if (ride.bus_final_arrival) {
                finalArrivalDate = moment(ride.bus_final_arrival)
                if (index !== (sortedData.length - 1))
                    onRoadDurationStatus = '(to last ride)'
                else onRoadDurationStatus = ''
            }

            const departureValid = !isNaN(departureDate.valueOf())
            const finalArrivalValid = !isNaN(finalArrivalDate.valueOf())

            if (departureValid && finalArrivalValid) onRoadDurationMs += finalArrivalDate.valueOf() - departureDate.valueOf()
        } catch (error) {
            console.error(`Error processing trip ID ${ride.id || 'unknown'}:`, error)
        }
    })

    let onRoadScore = 0
    if (rideDurationEstimateMs > 0) {
        onRoadScore = (rideDurationEstimateMs / onRoadDurationMs) * 100
        if (!isFinite(onRoadScore)) {
            onRoadScore = 0
        }
    }

    const timeDiff = formatMsToMinutes(onRoadDurationMs - rideDurationEstimateMs, true)
    const diffColor = Math.sign(onRoadDurationMs - rideDurationEstimateMs) < 0 ? colors.greenPositive_100 : colors.redCancel_100

    const startTime = currentTrip.started_at ? moment(currentTrip.started_at) : moment(sortedData[0].bus_initial_departure)
    let endTime, endToEndDurationStatus
    const availableRides = sortedData.filter(data => data.bus_final_arrival)
    let busFinalArrival = null
    if (availableRides.length > 0) busFinalArrival = moment(availableRides[availableRides.length - 1].bus_final_arrival)
    const lapTime = moment(fullLatLon[fullLatLon.length - 1].time)
    if (currentTrip.completed_at) {
        endTime = moment(currentTrip.completed_at)
        endToEndDurationStatus = ''
    } else if (busFinalArrival && busFinalArrival > lapTime) {
        endTime = busFinalArrival
        endToEndDurationStatus = '(to last ride)'
    } else if (lapTime) {
        endTime = lapTime
        endToEndDurationStatus = '(to last lap)'
    }

    const endToEndDuration = Math.abs(moment.duration(startTime.diff(endTime)).asMilliseconds())
    const endToEndDurationDisplay = formatMsToMinutes(endToEndDuration)

    const rideStartTime = moment(sortedData[0].bus_initial_departure)
    const totalRideDuration = Math.abs(moment.duration(rideStartTime.diff(endTime)).asMilliseconds())
    const totalRideDurationDisplay = formatMsToMinutes(totalRideDuration)

    let totalEfficiency = 0
    if (endToEndDuration > 0) {
        totalEfficiency = (onRoadDurationMs / totalRideDuration) * 100
        if (!isFinite(totalEfficiency)) {
            totalEfficiency = 0
        }
    }

    return (
        <CollapsibleHeaderPage headerText='Trip Detail'>
            <View style={travelDetailStyles[theme].container}>
                <View style={{
                    gap: 15,
                }}>
                    <Input.TitleDivide>Trip Duration Overview</Input.TitleDivide>

                    <Container.DetailRow>
                        <Input.Label>Started Time</Input.Label>
                        <Input.ValueText>{currentTrip.started_at ? utcToLocaltime(currentTrip.started_at) : 'N/A'}</Input.ValueText>
                    </Container.DetailRow>

                    {currentTrip.completed_at ? (
                        <Container.DetailRow>
                            <Input.Label>Completed Time</Input.Label>
                            <Input.ValueText>{utcToLocaltime(currentTrip.completed_at)}</Input.ValueText>
                        </Container.DetailRow>
                    ) : (
                        <></>
                    )}

                    {endToEndDuration ? (
                        <Container.DetailRow>
                            <Input.Label>Trip Duration</Input.Label>
                            <Input.ValueText>{endToEndDurationDisplay} {endToEndDurationStatus}</Input.ValueText>
                        </Container.DetailRow>
                    ) : (
                        <></>
                    )}
                </View>

                <View style={{
                    gap: 15,
                }}>
                    <Input.TitleDivide>Ride Overview</Input.TitleDivide>

                    <Container.DetailRow>
                        <Input.Label>On-Road Duration</Input.Label>
                        <Input.ValueText>{formatMsToMinutes(onRoadDurationMs)} {onRoadDurationStatus}</Input.ValueText>
                    </Container.DetailRow>

                    {totalRideDuration ? (
                        <Container.DetailRow>
                            <Input.Label>End to End Duration</Input.Label>
                            <Input.ValueText>{totalRideDurationDisplay} {endToEndDurationStatus}</Input.ValueText>
                        </Container.DetailRow>
                    ) : (
                        <></>
                    )}

                    <Container.DetailRow>
                        <Input.Label>Efficiency</Input.Label>
                        <Input.ValueText style={travelDetailStyles[theme].specialValue}>{totalEfficiency.toFixed(1)}%</Input.ValueText>
                    </Container.DetailRow>
                </View>

                <View style={{
                    gap: 15,
                }}>
                    <Input.TitleDivide>On-Road Duration Overview</Input.TitleDivide>

                    <Container.DetailRow>
                        <Input.Label>Estimated On-Road Duration:</Input.Label>
                        <Input.ValueText>{formatMsToMinutes(rideDurationEstimateMs)}</Input.ValueText>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Real On-Road Duration</Input.Label>
                        <View style={{
                            gap: 5,
                            flexDirection: 'row',
                        }}>
                            <Input.ValueText>{formatMsToMinutes(onRoadDurationMs)}</Input.ValueText>
                            <Input.ValueText style={{ color: diffColor }}>{`(${timeDiff})`}</Input.ValueText>
                        </View>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Travel Score</Input.Label>
                        <Input.ValueText style={travelDetailStyles[theme].specialValue}>
                            {onRoadScore.toFixed(1)}%
                        </Input.ValueText>
                    </Container.DetailRow>

                    <Input>
                        <TypeButton.Block
                            type={type}
                            onPress={setType}
                        />
                    </Input>
                </View>

                {sortedData.length > 0 && (
                    <View style={{
                        gap: 15,
                    }}>
                        <Input.TitleDivide>Ride Details</Input.TitleDivide>
                        {sortedData.sort(data => data.id).map((ride, index) => (
                            <RideDetailCard
                                key={index}
                                laps={currentRidesLaps}
                                ride={ride}
                                rideDurationEstimate={extractedTimes[ride.route.id]}
                            />
                        ))}
                    </View>
                )}

                <View style={[travelDetailStyles[theme].card, { height: screenWidth * 1.1, padding: 0, overflow: 'hidden' }]}>
                    <MapDisplay
                        centerCoordinate={centerLatLon ? [centerLatLon?.center.lon, centerLatLon?.center.lat] : [0, 0]}
                        zoomLevel={centerLatLon ? centerLatLon.zoom : 6}

                        rotateEnabled={false}
                    >
                        {fullLatLon && fullLatLon
                            .filter(data =>
                                data.coords !== undefined &&
                                Array.isArray(data.coords) &&
                                data.coords.every(coord => typeof coord === 'number')
                            )
                            .map((data, index) => (
                                <MarkerView
                                    key={index}
                                    coordinate={data.coords as [number, number]}
                                >
                                    <AnnotationContent
                                        fullVehicleTypes={completeVehicleTypes}
                                        data={data}
                                        title={data.name || ''}
                                        time={data.time}
                                    />
                                </MarkerView>
                            ))}
                    </MapDisplay>
                </View>
            </View>
        </CollapsibleHeaderPage >
    )
}