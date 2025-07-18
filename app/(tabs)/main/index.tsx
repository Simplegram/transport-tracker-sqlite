import Button from "@/components/button/BaseButton"
import Container from "@/components/Container"
import CustomIcon from "@/components/CustomIcon"
import Input from "@/components/input/Input"
import LoadingScreen from "@/components/LoadingScreen"
import CalendarModal from "@/components/modal/CalendarModal"
import GroupedRidesDisplay from "@/components/ride/GroupedRidesDisplay"
import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import useCalendar from "@/hooks/useCalendar"
import { useToggleLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { CompleteRide } from "@/src/types/CompleteTypes"
import { getGroupedData } from "@/src/utils/dataUtils"
import { getDateString, getTimeString } from "@/src/utils/dateUtils"
import { router, useFocusEffect } from "expo-router"
import moment from "moment"
import React, { useEffect, useMemo, useState } from "react"
import { View } from "react-native"

interface DateObject {
    dateString: string,
    day: number,
    month: number,
    timestamp: number,
    year: number
}

export default function HomePage() {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { travelDisplayMode } = useSettings()

    const {
        ridesAtDate, tripsAtDate,
        getRidesAtDate, getDates,
        dates, selectedDate,
        setSelectedDate,
    } = useCalendar()

    const { loading, setLoading, toggleLoading } = useToggleLoading(200)

    const [groupedData, setGroupedData] = useState<Record<string, CompleteRide[]>>()

    const [currentTime, setCurrentTime] = useState<string>(getTimeString())

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(getTimeString())
        }, 1000)
    }, [])

    const {
        showModal: showCalendarModal,
        openModalWithSearch: openCalendarModal,
        closeModal: closeCalendarModal
    } = useModalHandler()

    const markedDates = useMemo(() => {
        const marked: any = {}

        dates.forEach(date => {
            marked[date] = {
                ...marked[date],
                marked: true,
                color: '#dcf8c6',
            }
        })

        marked[selectedDate] = {
            ...marked[selectedDate],
            selected: true,
            selectedColor: '#00adf5',
            selectedTextColor: 'white',
        }

        return marked
    }, [selectedDate, dates])

    const onDayPress = (day: DateObject) => {
        if (day.dateString !== selectedDate) toggleLoading()
        setSelectedDate(day.dateString)
        closeCalendarModal()
    }

    const refetchTravels = async () => {
        await getDates()
        await getRidesAtDate()
    }

    useFocusEffect(
        React.useCallback(() => {
            setSelectedDate(getDateString())
            getDates()
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            if (ridesAtDate) {
                const processData = () => {
                    const data = getGroupedData(ridesAtDate)
                    setGroupedData(data)
                }
                processData()
            }
            setLoading(false)
        }, [ridesAtDate])
    )

    useFocusEffect(
        React.useCallback(() => {
            getRidesAtDate()
        }, [selectedDate])
    )

    const currentDate = moment(getDateString())

    return (
        <Container style={{
            justifyContent: 'flex-end',
        }}>
            <View style={{
                justifyContent: 'flex-end',

                borderColor: theme.palette.borderColor,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                }}>
                    <View>
                        <Input.Header>{currentDate.format('dddd')}</Input.Header>
                        <Input.Header>{currentDate.format('LL')}</Input.Header>
                    </View>
                    <Input.Header>{currentTime}</Input.Header>
                </View>
            </View>
            <View style={[
                {
                    paddingTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderWidth: 1,
                    borderRadius: 10,

                    borderColor: theme.palette.borderColor,
                }, travelDisplayMode === 'card' && {
                    height: 395,
                }, travelDisplayMode === 'list' && {
                    flex: 1,
                }
            ]}>
                {loading || !groupedData ? (
                    <LoadingScreen></LoadingScreen>
                ) : (
                    <GroupedRidesDisplay
                        data={groupedData}
                        trips={tripsAtDate}
                        currentDate={selectedDate}
                        refetch={() => {
                            setLoading(true)
                            refetchTravels()
                        }}
                    />
                )}
            </View>
            <View style={{
                gap: 8,
                width: '100%',
                flexDirection: 'row',
            }}>
                <Button.Add label="Estimation" onPress={() => router.push("/main/estimate")} />
                <Button.Add style={{ flex: 0.5 }} onPress={() => {
                    setLoading(true)
                    refetchTravels()
                }}>
                    <CustomIcon style={{ color: theme.palette.textWhite }} name="arrows-rotate" />
                </Button.Add>
                <Button.Add label="Calendar" onPress={() => openCalendarModal()} />
            </View>
            <CalendarModal
                dates={dates}
                markedDates={markedDates}
                currentSelectedDate={selectedDate}
                modalElements={{
                    isModalVisible: showCalendarModal,
                    onClose: closeCalendarModal,
                    onSubmit: onDayPress
                }}
            />
        </Container>
    )
}