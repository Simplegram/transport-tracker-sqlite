import { getCalendars } from 'expo-localization'
import moment from "moment-timezone"
import { padNumber } from "./utils"

const timezone = getCalendars()[0].timeZone || 'Africa/Casablanca' // defaults to UTC+0 if null, can also use 'Atlantic/Reykjavik'

export const getCurrentTime = () => {
    const todaysDate = moment().tz(timezone)
    return todaysDate
}

export const getTimeString = () => {
    const todaysDate = getCurrentTime()
    const formattedDate = todaysDate.format("HH:mm:ss")
    return formattedDate
}

export const getDateString = () => {
    const todaysDate = getCurrentTime()
    const formattedDate = todaysDate.format("Y-MM-DD")
    return formattedDate
}

export const getCleanMomentTime = (date: string) => {
    const cleanDate = date.replace("T", " ")
    const momentTime = moment(cleanDate, "YYYY-MM-DD HH:mm:ss")

    return momentTime
}

export const getDateToIsoString = (date: Date) => {
    const isoString = moment(date).tz(timezone).format()

    return isoString
}

export const formatDate = (date: string) => {
    const cleanDate = date.replace("T", " ")
    const formattedDate = moment(cleanDate, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss")

    return formattedDate
}

export const utcToLocaltime = (utcTime: string, format: string = "YYYY-MM-DD HH:mm:ss") => {
    const momentTime = moment(utcTime).tz(timezone).format(format)

    return momentTime
}

export const getMonthsSinceEarliestDate = (dates: string[], selectedDate: string): number => {
    if (!dates || dates.length === 0) {
        return 0
    }

    const earliestDate = moment(dates[0]).set('date', 1)
    const currentSelectedDate = moment(selectedDate).set('date', 1)

    const monthsDifference = currentSelectedDate.diff(earliestDate, 'months')

    return monthsDifference
}

export const getFutureMonthFromLatestDate = (selectedDate: string, offset: number = 0): number => {
    const today = moment(getDateString()).set('date', 1)
    let latestDate = moment(selectedDate).set('date', 1)

    const monthsDifference = today.diff(latestDate, 'months') + offset

    return monthsDifference
}

export const timeToMinutes = (averageTime: number) => {
    const momentTime = moment().startOf('day').seconds(averageTime)
    const stringTime = `${momentTime.hours()}h ${padNumber(momentTime.minutes())}m ${padNumber(momentTime.seconds())}s`

    return stringTime
}

export const addTime = (time: string, initial_time?: string) => {
    const today = initial_time ? moment(initial_time, "HH:mm:ss") : moment(getCurrentTime())
    const momentTime = moment(time, "HH:mm:ss")

    const addedTime = today.add(momentTime.hours(), 'hours').add(momentTime.minutes(), 'minutes').add(momentTime.seconds(), 'seconds')
    const formattedTime = addedTime.format("HH:mm:ss")

    return formattedTime
}

export const sumTimesToMs = (times: number[]) => {
    let timeSum = moment("00:00:00", "HH:mm:ss")

    for (const time of times) {
        const momentTime = moment().startOf('day').seconds(time)

        timeSum = timeSum.add(momentTime.hours(), 'hours').add(momentTime.minutes(), 'minutes').add(momentTime.seconds(), 'seconds')
    }

    const startOfDay = moment().startOf('day')
    const milliseconds = timeSum.diff(startOfDay)

    return milliseconds
}

export const formatMsToMinutes = (milliseconds: number, showSign: boolean = false): string => {
    if (isNaN(milliseconds)) {
        return 'N/A'
    }
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const sign = showSign ? Math.sign(milliseconds) < 0 ? '' : '+' : ''
    return `${sign}${minutes} mins`
}

export const formatMsToHoursMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A'
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m / ${totalMinutes}m`
}

export const getDiffString = (duration: moment.Duration, usePrefix: boolean = false) => {
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    const hoursString = ((hours !== 0) && !isNaN(hours)) ? `${Math.abs(hours)}h ` : ''
    const minutesString = ((minutes !== 0) && !isNaN(minutes)) ? `${padNumber(Math.abs(minutes))}m ` : ''
    const secondsString = !isNaN(seconds) ? `${padNumber(Math.abs(seconds))}s` : 'N/A'

    const prefix = usePrefix ? (hours < 0 || minutes < 0 || seconds < 0) ? "+" : "-" : ""

    const diffString = `${prefix} ${hoursString}${minutesString}${secondsString}`

    return diffString
}