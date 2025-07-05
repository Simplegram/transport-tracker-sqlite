import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { CompleteTravel } from "@/src/types/CompleteTravels"
import { getDiffString } from "@/src/utils/dateUtils"
import { formatLapTimeDisplay } from "@/src/utils/utils"
import moment from "moment"
import { Text, View } from "react-native"
import Container from "../Container"
import Divider from "../Divider"
import Input from "../input/Input"

interface TravelDetailCardProp {
    ride: CompleteTravel
    rideDuration?: number
}

export default function IndividualTravelDetailCard({ ride, rideDuration }: TravelDetailCardProp) {
    const { theme } = useTheme()

    try {
        const departureDate = moment(ride.bus_initial_departure)
        const finalArrivalDate = moment(ride.bus_final_arrival)
        const travelDuration = moment.duration(finalArrivalDate.diff(departureDate, 'seconds', true), "seconds")
        const durationString = getDiffString(travelDuration)

        const departureTime = formatLapTimeDisplay(ride.bus_initial_departure, true) || 'N/A'
        const arrivalTime = formatLapTimeDisplay(ride.bus_final_arrival, true) || 'N/A'
        const timeString = `${departureTime} - ${arrivalTime}`

        const stopString = `${ride.first_stop.name} to ${ride.last_stop.name}`
        const tripIdentifier = `${ride.route.code} | ${ride.vehicle_code || 'N/A'}`

        const estimateDuration = moment.duration(rideDuration, "seconds")
        const estimateDurationString = getDiffString(estimateDuration)
        const realEstimateDiff = estimateDuration.subtract(travelDuration)

        const diffColor = realEstimateDiff.seconds() > 0 ? colors.greenPositive_100 : colors.redCancel_100

        const diffString = getDiffString(realEstimateDiff, true)

        return (
            <Container.DetailRow key={ride.id}>
                <Text style={travelDetailStyles[theme].specialValue}>{tripIdentifier}</Text>
                <Input.ValueText>{stopString}</Input.ValueText>
                <Input.ValueText>{timeString}</Input.ValueText>
                <Divider />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Input.ValueText>Estimate</Input.ValueText>
                    <Input.ValueText style={{ alignSelf: 'flex-end' }}>{estimateDurationString}</Input.ValueText>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Input.ValueText>Real</Input.ValueText>
                    <Input.ValueText>{durationString}</Input.ValueText>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Input.ValueText>Diff</Input.ValueText>
                    <Input.ValueText style={{ color: diffColor }}>{diffString}</Input.ValueText>
                </View>
            </Container.DetailRow>
        )
    } catch (error) {
        console.error(`Error calculating duration for trip ID ${ride.id || 'unknown'}:`, error)
        return (
            <Container.DetailRow key={ride.id}>
                <Input.Subtitle>Trip ID {ride.id || 'N/A'}</Input.Subtitle>
                <Input.ValueText>Calculation Error</Input.ValueText>
            </Container.DetailRow>
        )
    }
}

interface LabelValueProps {
    label: string
    value: string
}

export function JustifiedLabelValue({ label, value }: LabelValueProps) {
    const { theme } = useTheme()

    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Input.ValueText>{label}</Input.ValueText>
            <Input.ValueText>{value}</Input.ValueText>
        </View>
    )
}