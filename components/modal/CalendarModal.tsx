import { useTheme } from "@/context/ThemeContext"
import { calendarTheme } from "@/src/styles/CalendarStyles"
import { StandaloneModalProps } from "@/src/types/StandaloneModalTypes"
import { getDateString, getFutureMonthFromLatestDate, getMonthsSinceEarliestDate } from "@/src/utils/dateUtils"
import { View } from "react-native"
import { CalendarList } from "react-native-calendars"
import Button from "../button/BaseButton"
import ModalTemplate from "../ModalTemplate"

interface CalendarModalProps {
    dates: any
    markedDates: {
        [date: string]: {
            [key: string]: any
        }
    }
    currentSelectedDate: string
    modalElements: StandaloneModalProps
}

export default function CalendarModal({ dates, markedDates, currentSelectedDate, modalElements }: CalendarModalProps) {
    const { theme } = useTheme()

    const pastScrollRange = getMonthsSinceEarliestDate(dates, currentSelectedDate)
    const futureScrollRange = getFutureMonthFromLatestDate(currentSelectedDate)

    return (
        <ModalTemplate
            visible={modalElements.isModalVisible}
            animationType="slide"
            onRequestClose={modalElements.onClose}
        >
            <ModalTemplate.Backdrop>
                <ModalTemplate.CalendarContainer>
                    <CalendarList
                        current={currentSelectedDate}
                        pastScrollRange={pastScrollRange}
                        futureScrollRange={futureScrollRange}
                        markedDates={markedDates}
                        onDayPress={modalElements.onSubmit}
                        theme={calendarTheme[theme]}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                        flexDirection: 'row',
                        gap: 5,
                    }}>
                        <Button.Add label="Set Today" onPress={() => modalElements.onSubmit({ dateString: getDateString() })} style={{ flex: 0 }} />
                        <Button.Dismiss label="Close" onPress={modalElements.onClose} style={{ flex: 0 }} />
                    </View>
                </ModalTemplate.CalendarContainer>
            </ModalTemplate.Backdrop>
        </ModalTemplate>
    )
}