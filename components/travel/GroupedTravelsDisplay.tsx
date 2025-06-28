import React from 'react'
import PagerView from 'react-native-pager-view'

import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { DataItemWithNewKey, getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { useSettings } from '@/context/SettingsContext'
import moment from 'moment'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import Input from '../input/Input'
import { TravelCard } from './TravelCard'
import TravelCards from './TravelCards'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
    refetch: () => void
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate, refetch }: GroupedDataDisplayProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { travelDisplayMode } = useSettings()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext()

    const directionNames = getKeysSortedByCreatedAt(finalGroupedData)

    const handleItemPress = (directionNameKey: string, itemIndex: number) => {
        const itemToSelect = finalGroupedData[directionNameKey][itemIndex]
        if (itemToSelect) {
            setSelectedItem(itemToSelect)
            router.push("main/editTravel")
        }
    }

    const handleViewTravelDetails = (directionNameKey: string) => {
        setSelectedTravelItems(finalGroupedData[directionNameKey])
        router.push("main/travelDetail")
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

    return (
        <View style={[
            {
                gap: 5,
                overflow: 'hidden',

                justifyContent: 'center',
            }, travelDisplayMode === 'card' && { maxHeight: '100%' }
        ]}>
            {directionNames.length > 0 ? (
                <AnimatedPagerView
                    style={styles.pagerView}
                    pageMargin={10}
                    initialPage={0}
                >
                    {directionNames.map((directionNameKey, index) => (
                        travelDisplayMode === 'card' ? (
                            <View key={directionNameKey} style={styles.pagerViewContentContainer}>
                                <Pressable
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingBottom: 20,
                                    }}
                                    onPress={() => handleViewTravelDetails(directionNameKey)}
                                >
                                    <Input.Title>{moment(currentDate).format('LL')}</Input.Title>
                                    <Input.Title>{`Direction (${index + 1}/${directionNames.length}): ${directionNameKey}`}</Input.Title>
                                </Pressable>
                                <View key={directionNameKey} style={styles.cardCanvas}>
                                    <TravelCards
                                        data={finalGroupedData[directionNameKey]}
                                        directionNameKey={directionNameKey}
                                        onPress={handleItemPress}
                                    />
                                </View>
                            </View>
                        ) :
                            travelDisplayMode === 'list' && (
                                <React.Fragment key={directionNameKey}>
                                    <Pressable
                                        style={{
                                            width: '100%',

                                            alignItems: 'center',
                                            justifyContent: 'center',

                                            paddingBottom: 10,
                                            paddingHorizontal: 5,
                                        }}
                                        onPress={() => handleViewTravelDetails(directionNameKey)}
                                    >
                                        <Input.Title>{moment(currentDate).format('LL')}</Input.Title>
                                        <Input.Title>{`Direction (${index + 1}/${directionNames.length}): ${directionNameKey}`}</Input.Title>
                                    </Pressable>
                                    <FlatList
                                        data={finalGroupedData[directionNameKey]}
                                        renderItem={({ item, index }) => (
                                            <TravelCard
                                                key={index}
                                                item={item}
                                                index={index}
                                                directionNameKey={directionNameKey}
                                                onPress={handleItemPress}
                                            />
                                        )}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
                                    />
                                </React.Fragment>
                            )
                    ))}
                </AnimatedPagerView>
            ) : (
                <View style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Input.Subtitle>No travel to display for today</Input.Subtitle>
                </View>
            )}
        </View >
    )
}