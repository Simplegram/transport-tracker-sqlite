import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import React from "react"
import { View } from "react-native"
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import StackedTravelCard from "./RideCard"

interface TravelCardsProps {
    data: DataItemWithNewKey[]
    directionNameKey: string
    onPress: (key: string, index: number) => void
}

export default function RideCards({ data, directionNameKey, onPress }: TravelCardsProps) {
    const duration = 200
    const activeIndex = useSharedValue(0)

    const flingUp = Gesture.Fling()
        .direction(Directions.UP)
        .onStart(() => {
            if ((activeIndex.value + 1) >= (data.length - 1)) {
                activeIndex.value = withTiming(data.length - 1, { duration })
                return
            }
            activeIndex.value = withTiming(Math.ceil(activeIndex.value) + 1, { duration })
        })

    const flingDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart(() => {
            if ((activeIndex.value - 1) <= 0) {
                activeIndex.value = withTiming(0, { duration })
                return
            }
            activeIndex.value = withTiming(Math.ceil(activeIndex.value) - 1, { duration })
        })

    return (
        <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
            <View style={{
                gap: 12,
                flexGrow: 1,
            }}>
                {data.map((item, index) => (
                    <StackedTravelCard
                        key={index}
                        item={item}
                        index={index}
                        directionNameKey={directionNameKey}
                        totalLength={data.length - 1}
                        activeIndex={activeIndex}
                        onPress={() => onPress(directionNameKey, index)}
                    />
                ))}
            </View>
        </GestureDetector>
    )
}