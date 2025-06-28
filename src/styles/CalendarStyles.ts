import { colors } from "@/src/const/color"
import { Theme } from "react-native-calendars/src/types"

const lightCalendarTheme: Theme = {
    calendarBackground: colors.white_100,
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    arrowColor: '#00adf5',
    indicatorColor: '#00adf5',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: 'bold',
    textDayFontSize: 15,
    textMonthFontSize: 17,
    textDayHeaderFontSize: 15,
    'stylesheet.calendar.header': {
        monthText: {
            margin: 10,
            fontSize: 17,
            fontWeight: 'bold',
            color: 'black',
        },
        dayHeader: {
            width: 32,
            marginTop: 2,
            marginBottom: 7,
            textAlign: 'center',
            color: '#2d4150',
        }
    }
}

export const calendarTheme = {
    light: lightCalendarTheme,
    dark: {
        ...lightCalendarTheme,
        calendarBackground: '#000',
        dayTextColor: colors.white_200,
        monthTextColor: colors.white_200,
        'stylesheet.calendar.header': {
            dayHeader: {
                width: 32,
                marginTop: 2,
                marginBottom: 7,
                textAlign: 'center',

                color: colors.white_300,
            }
        }
    },
}