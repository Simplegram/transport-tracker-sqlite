import { CompleteRide } from "@/src/types/CompleteTypes"
import { utcToLocaltime } from "@/src/utils/dateUtils"
import moment from "moment-timezone"
import { useEffect, useState } from "react"
import useRides from "./data/useRides"

function formatDate(
    date: Date,
    custom_hours: number | null = null,
    custom_minutes: number | null = null,
    custom_seconds: number | null = null
) {
    if (!date) {
        date = new Date()
    }

    if (!(date instanceof Date)) {
        return "Invalid Date"
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = custom_hours ?? String(date.getHours()).padStart(2, '0')
    const minutes = custom_minutes ?? String(date.getMinutes()).padStart(2, '0')
    const seconds = custom_seconds ?? String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function getDateToday() {
    const dateToday = new Date()
    return formatDate(dateToday)
}

export default function useCalendar() {
    const { completeRides, getRidesByTimeBetween, getCreatedAts } = useRides()

    const [ridesAtDate, setRidesAtDate] = useState<CompleteRide[]>([])
    const [selectedDate, setSelectedDate] = useState<string>(getDateToday)

    const [dates, setDates] = useState<string[]>([])

    async function getRidesAtDate() {
        const start_time = moment(selectedDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString()
        const end_time = moment(selectedDate).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toISOString()

        await getRidesByTimeBetween(start_time, end_time)
    }

    const getDates = async () => {
        const createdAts = getCreatedAts()

        if (!createdAts || createdAts.length === 0) {
            console.log("No dates found.")
            setDates([])
            return
        }

        const formattedDates = createdAts.map(date => utcToLocaltime(date, "YYYY-MM-DD"))
        const uniqueDates = Array.from(new Set(formattedDates))
        uniqueDates.sort()

        setDates(uniqueDates)
    }

    const getInitialData = async () => {
        await getDates()
    }

    useEffect(() => {
        getInitialData()
    }, [])

    useEffect(() => {
        setRidesAtDate(completeRides)
    }, [completeRides])

    useEffect(() => {
        getRidesAtDate()
    }, [selectedDate])

    return {
        ridesAtDate, getRidesAtDate, getDates,
        dates, selectedDate, setSelectedDate,
    }
}