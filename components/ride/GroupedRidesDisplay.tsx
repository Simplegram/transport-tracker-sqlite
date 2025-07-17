import React from 'react'
import PagerView from 'react-native-pager-view'

import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { useSettings } from '@/context/SettingsContext'
import useTripTemplates from '@/hooks/data/templates/useTripTemplates'
import { CompleteRide, CompleteTrip } from '@/src/types/CompleteTypes'
import moment from 'moment'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import Input from '../input/Input'
import { RideCard } from './RideCard'
import RideCards from './RideCards'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

interface GroupedRidesDisplayProps {
    data: Record<string, CompleteRide[]>
    trips: CompleteTrip[]
    currentDate: string
    refetch: () => void
}

export default function GroupedRidesDisplay({ data: finalGroupedData, trips, currentDate, refetch }: GroupedRidesDisplayProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { travelDisplayMode } = useSettings()

    const { setSelectedRide, setSelectedRides } = useTravelContext()

    const { getTripTemplateById } = useTripTemplates()

    const directionNames = getKeysSortedByCreatedAt(finalGroupedData)

    const handleRidePress = (directionNameKey: string, itemIndex: number) => {
        const itemToSelect = finalGroupedData[directionNameKey][itemIndex]
        if (itemToSelect) {
            setSelectedRide(itemToSelect)
            router.push("/main/editRide")
        }
    }

    const handleRideTemplatePress = async (tripIdx: number, rideIdx: number) => {
        let itemToSelect = trips[tripIdx].rides[rideIdx]
        if (itemToSelect) {
            setSelectedRide(itemToSelect)
            router.push("/main/editRide")
        }
    }

    const handleViewTravelDetails = (directionNameKey: string) => {
        setSelectedRides(finalGroupedData[directionNameKey])
        router.push("/main/travelDetail")
    }

    const styles = StyleSheet.create({
        pagerView: {
            height: travelDisplayMode === 'card' ? 380 : '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        pagerViewContentContainer: {
            overflow: 'hidden',
            justifyContent: 'flex-end',
            paddingBottom: 10,

            borderColor: theme.palette.borderColor,
        },
        cardCanvas: {
            minHeight: 300,
            maxHeight: 360,
        },
    })

    const renderHeader = (title: string, directionNameKey: string, index: number, total: number) => (
        <Pressable
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: travelDisplayMode === 'card' ? 20 : 10,
                width: travelDisplayMode === 'list' ? '100%' : undefined,
                paddingHorizontal: travelDisplayMode === 'list' ? 5 : undefined,
            }}
            onPress={() => handleViewTravelDetails(directionNameKey)}
        >
            <Input.Title>{moment(currentDate).format('LL')}</Input.Title>
            <Input.Title>{`${title} (${index + 1}/${total})`}</Input.Title>
        </Pressable>
    )

    const renderContent = (data: any[], directionKey: string, onPress: any) => {
        if (travelDisplayMode === 'card') {
            return (
                <View style={styles.cardCanvas}>
                    <RideCards
                        data={data}
                        directionNameKey={directionKey}
                        onPress={onPress}
                    />
                </View>
            )
        }

        return (
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <RideCard
                        key={index}
                        item={item}
                        index={index}
                        directionNameKey={directionKey}
                        onPress={onPress}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
            />
        )
    }

    const renderEmptyState = (message: string) => (
        <View style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Input.Subtitle>{message}</Input.Subtitle>
        </View>
    )

    return (
        <View style={[
            {
                gap: 5,
                overflow: 'hidden',
                justifyContent: 'center',
            },
            travelDisplayMode === 'card' && { maxHeight: '100%' }
        ]}>
            {(directionNames.length === 0 && trips.length === 0) ? (
                renderEmptyState("No travel to display for today")
            ) : (
                <AnimatedPagerView
                    style={styles.pagerView}
                    pageMargin={10}
                    initialPage={0}
                >
                    {directionNames.map((directionNameKey, index) => (
                        <View key={directionNameKey} style={styles.pagerViewContentContainer}>
                            {renderHeader(`Direction: ${directionNameKey}`, directionNameKey, index, directionNames.length)}
                            {renderContent(finalGroupedData[directionNameKey], directionNameKey, handleRidePress)}
                        </View>
                    ))}

                    {trips.map((trip, index) => {
                        if (!trip.template_id) return null

                        const tripTemplate = getTripTemplateById(trip.template_id)
                        if (!tripTemplate) return null

                        return (
                            <View key={`${trip.id}-${trip.name}-${index}`} style={styles.pagerViewContentContainer}>
                                {renderHeader(`Trip: ${tripTemplate.name}`, tripTemplate.name, index, trips.length)}
                                {renderContent(trip.rides, index.toString(), handleRideTemplatePress)}
                            </View>
                        )
                    }).filter(Boolean)}
                </AnimatedPagerView>
            )}
        </View>
    )
}