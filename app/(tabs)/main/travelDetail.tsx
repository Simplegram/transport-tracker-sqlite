import AnnotationContent from '@/components/AnnotationContent'
import TypeButton from '@/components/button/TypeButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Container from '@/components/Container'
import Input from '@/components/input/Input'
import LoadingScreen from '@/components/LoadingScreen'
import MapDisplay from '@/components/MapDisplay'
import RideDetailCard from '@/components/ride/RideDetailCard'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import useLaps from '@/hooks/data/useLaps'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import useTravelDetail from '@/hooks/useTravelDetail'
import { colors } from '@/src/const/color'
import { travelDetailStyles } from '@/src/styles/TravelDetailStyles'
import { CompleteRide } from '@/src/types/CompleteTypes'
import { Stop } from '@/src/types/Types'
import { formatMsToMinutes, sumTimesToMs } from '@/src/utils/dateUtils'
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
    average: 'avg_travel_time',
    worst: 'max_top_5_longest'
}

export default function TravelDetail() {
    const { theme } = useTheme()

    const { selectedRides } = useTravelContext()

    const { completeVehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()
    const { completeLaps: rideLaps, getLaps, getLapsByRideIds } = useLaps()

    const refetchTravelData = () => {
        getLaps()
        getCompleteVehicleTypes()
    }
    const { rideDurationEstimates, getAllRideTimes } = useTravelDetail()

    const [dataToUse, setDataToUse] = useState<CompleteRide[]>([])
    const [type, setType] = useState<'best' | 'average' | 'worst'>('average')

    if (!selectedRides) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    useEffect(() => {
        setDataToUse(selectedRides)

        const allLaps = selectedRides.map(ride => ride.id)
        getLapsByRideIds(allLaps)

        const inputItems = selectedRides.map((ride) => {
            return {
                routeId: ride.route.id,
                directionId: ride.direction.id,
                startStopId: ride.first_stop.id,
                endStopId: ride.last_stop.id
            }
        })
        getAllRideTimes(inputItems)
    }, [selectedRides])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()

            const allLaps = selectedRides.map(ride => ride.id)
            getLapsByRideIds(allLaps)
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            setDataToUse(selectedRides)
        }, [selectedRides])
    )

    if (!rideDurationEstimates) return (
        <LoadingScreen />
    )

    const sortedData = [...dataToUse].sort((a, b) => {
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
    if (rideLaps)
        lapLatLon = rideLaps
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

    const averageRideTimes = Object.values(rideDurationEstimates).map(
        (timeData) => timeData[typeIndex[type]]
    )

    const extractedTimes = Object.keys(rideDurationEstimates).reduce((acc, routeId) => {
        const timeData = rideDurationEstimates[routeId]
        const selectedTime = timeData[typeIndex[type]]

        acc[routeId] = selectedTime

        return acc
    }, {} as { [key: string]: any })

    let averageRouteDurationMilliseconds = sumTimesToMs(averageRideTimes)
    let totalOnRoadMilliseconds = 0
    let sumInitialStopDurationMilliseconds = 0

    sortedData.forEach(trip => {
        try {
            const initialArrivalDate = moment(trip.bus_initial_arrival)
            const departureDate = moment(trip.bus_initial_departure)
            const finalArrivalDate = moment(trip.bus_final_arrival)

            const initialArrivalValid = !isNaN(initialArrivalDate.valueOf())
            const departureValid = !isNaN(departureDate.valueOf())
            const finalArrivalValid = !isNaN(finalArrivalDate.valueOf())

            if (departureValid && finalArrivalValid) {
                if (finalArrivalDate.valueOf() >= departureDate.valueOf()) {
                    totalOnRoadMilliseconds += finalArrivalDate.valueOf() - departureDate.valueOf()
                } else {
                    console.warn(`Trip ID ${trip.id}: Final arrival (${trip.bus_final_arrival}) is before initial departure (${trip.bus_initial_departure}). Excluding from duration calcs.`)
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid departure or final arrival date.`)
            }


            if (initialArrivalValid && departureValid) {
                if (departureDate.valueOf() >= initialArrivalDate.valueOf()) {
                    sumInitialStopDurationMilliseconds += departureDate.valueOf() - initialArrivalDate.valueOf()
                } else {
                    console.warn(`Trip ID ${trip.id}: Initial departure (${trip.bus_initial_departure}) is before initial arrival (${trip.bus_initial_arrival}). Excluding from initial stop duration calc.`)
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid initial arrival or departure date for stop time calc.`)
            }

        } catch (error) {
            console.error(`Error processing trip ID ${trip.id || 'unknown'}:`, error)
        }
    })

    let efficiencyPercentage = 0
    if (averageRouteDurationMilliseconds > 0) {
        efficiencyPercentage = (averageRouteDurationMilliseconds / totalOnRoadMilliseconds) * 100
        if (!isFinite(efficiencyPercentage)) {
            efficiencyPercentage = 0
        }
    }

    const timeDiff = formatMsToMinutes(totalOnRoadMilliseconds - averageRouteDurationMilliseconds, true)
    const diffColor = Math.sign(totalOnRoadMilliseconds - averageRouteDurationMilliseconds) < 0 ? colors.greenPositive_100 : colors.redCancel_100

    return (
        <CollapsibleHeaderPage headerText='Travel Detail'>
            <View style={travelDetailStyles[theme].container}>
                <View style={{
                    gap: 15,
                }}>
                    <Input.TitleDivide>Duration Overview</Input.TitleDivide>

                    <Container.DetailRow>
                        <Input.Label>Estimated On-Road Duration:</Input.Label>
                        <Input.ValueText>{formatMsToMinutes(averageRouteDurationMilliseconds)}</Input.ValueText>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Real On-Road Duration:</Input.Label>
                        <View style={{
                            gap: 5,
                            flexDirection: 'row',
                        }}>
                            <Input.ValueText>{formatMsToMinutes(totalOnRoadMilliseconds)}</Input.ValueText>
                            <Input.ValueText style={{ color: diffColor }}>{`(${timeDiff})`}</Input.ValueText>
                        </View>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Travel Score:</Input.Label>
                        <Input.ValueText style={travelDetailStyles[theme].specialValue}>
                            {efficiencyPercentage.toFixed(1)}%
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
                        <Input.TitleDivide>Individual Travel Detail</Input.TitleDivide>
                        {sortedData.sort(data => data.id).map((ride, index) => (
                            <RideDetailCard
                                key={index}
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
                                        data_id={data.id}
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