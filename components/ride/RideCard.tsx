import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { utcToLocaltime } from "@/src/utils/dateUtils"
import { calculateDuration } from "@/src/utils/utils"
import React from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { interpolate, interpolateColor, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated"
import Divider from "../Divider"
import Input from "../input/Input"

interface CardContentProps {
    item: DataItemWithNewKey
}

function RideCardContent({ item }: CardContentProps) {
    const { theme } = useTheme()

    return (
        <View
            key={item.id}
            style={travelCardStyles[theme].card}
            collapsable={false}
        >
            <View style={{ alignItems: 'center' }}>
                <Input.SubtitlePrimary style={{ textAlign: 'center' }}>
                    {item.route.code} | {item.route.name || item.route.code || 'N/A'}
                </Input.SubtitlePrimary>
                <Input.Subtitle style={{ textAlign: 'center' }}>
                    {item.vehicle_code || 'N/A'}
                </Input.Subtitle>
            </View>

            <Divider />

            <View style={travelCardStyles[theme].stopsTimeSection}>
                <View style={travelCardStyles[theme].stopTimeBlock}>
                    <Input.ValuePrimary style={{ textAlign: 'center' }}>{item.first_stop.name || 'N/A'}</Input.ValuePrimary>
                    <Input.Text style={{ textAlign: 'center' }}>
                        {item.bus_initial_departure ? utcToLocaltime(item.bus_initial_departure, "HH:mm:ss") : 'N/A'}
                    </Input.Text>
                </View>

                <View style={travelCardStyles[theme].stopArrowBlock}>
                    <Input.Title>➜</Input.Title>
                    <Input.Text style={{ textAlign: 'center' }}>{calculateDuration(item)}</Input.Text>
                </View>

                <View style={travelCardStyles[theme].stopTimeBlock}>
                    <Input.ValuePrimary style={{ textAlign: 'center' }}>{item.last_stop.name || 'N/A'}</Input.ValuePrimary>
                    <Input.Text style={{ textAlign: 'center' }}>
                        {item.bus_final_arrival ? utcToLocaltime(item.bus_final_arrival, "HH:mm:ss") : 'N/A'}
                    </Input.Text>
                </View>
            </View>

            <Divider />

            {item.lapCount && (
                <>
                    <View style={travelCardStyles[theme].lapsSection}>
                        <Input.ValueText style={{ textAlign: 'center' }}>{item.lapCount} lap(s)</Input.ValueText>
                    </View>
                    <Divider />
                </>
            )}

            <View style={travelCardStyles[theme].notesSection}>
                <Input.Text>Notes:</Input.Text>
                <Input.ValueText style={{ fontWeight: '300', fontStyle: 'italic' }}>
                    {item.notes || 'No notes'}
                </Input.ValueText>
            </View>
        </View>
    )
}

interface RideCardProps {
    item: DataItemWithNewKey
    index: number
    directionNameKey: string
    onPress: (directionNameKey: string, itemIndex: number) => void
}

export function RideCard({ item, index, directionNameKey, onPress }: RideCardProps) {
    const { theme } = useTheme()

    const borderColor = useSharedValue(0)
    const cardStyles = useAnimatedStyle(() => {
        return {
            borderRadius: 10,
            borderColor: interpolateColor(
                borderColor.value,
                [0, 1],
                [travelCardStyles[theme].card.borderColor, theme === 'light' ? colors.primary : colors.primary_100]
            ),
            borderWidth: 1,
        }
    })

    const singleTap = Gesture.Tap()
        .maxDuration(100)
        .onBegin(() => {
            borderColor.value = withSequence(
                withTiming(1, { duration: 100 }),
                withDelay(50, withTiming(0, { duration: 100 }))
            )
        })
        .onStart(() => {
            runOnJS(onPress)(directionNameKey, index)
        })

    return (
        <Animated.View style={[
            {
                width: '100%',
                borderRadius: 10,
            }, cardStyles
        ]}>
            <GestureDetector gesture={Gesture.Exclusive(singleTap)}>
                <RideCardContent item={item} />
            </GestureDetector>
        </Animated.View>
    )
}

interface StackedCardProps extends RideCardProps {
    activeIndex: SharedValue<number>
    totalLength: number
}

export default function StackedRideCard({ item, index, directionNameKey, activeIndex, totalLength, onPress }: StackedCardProps) {
    const { theme } = useTheme()

    const styles = useAnimatedStyle(() => {
        return {
            width: '100%',
            position: 'absolute',
            zIndex: Math.round(interpolate(
                activeIndex.value,
                [index - 1, index, index + 1],
                [0, totalLength - index, 0]
            )),
            opacity: interpolate(
                activeIndex.value,
                [index - 1, index, index + 1],
                [1 - 1 / 3, 1, 1 - 1 / 3]
            ),
            transform: [
                {
                    translateY: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [travelCardStyles[theme].card.gap, ((totalLength + 1) > 1) ? -3 : 0, -1.9 * travelCardStyles[theme].card.gap]
                    )
                },
                {
                    scale: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [0.96, 1, 0.96]
                    )
                }
            ],
            overflow: 'hidden',
        }
    })

    const borderColor = useSharedValue(0)
    const cardStyles = useAnimatedStyle(() => {
        return {
            borderRadius: 10,
            borderColor: interpolateColor(
                borderColor.value,
                [0, 1],
                [travelCardStyles[theme].card.borderColor, theme === 'light' ? colors.primary : colors.primary_100]
            ),
            borderWidth: 1,
        }
    })

    const doubleTap = Gesture.Tap()
        .maxDuration(100)
        .numberOfTaps(2)
        .onBegin(() => {
            borderColor.value = withSequence(
                withTiming(1, { duration: 100 }),
                withDelay(50, withTiming(0, { duration: 100 }))
            )
        })
        .onStart(() => {
            runOnJS(onPress)(directionNameKey, index)
        })

    return (
        <Animated.View style={[styles, cardStyles]}>
            <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
                <RideCardContent item={item} />
            </GestureDetector>
        </Animated.View>
    )
}