import moment from "moment"
import { Travel } from "../types/Travels"

const sortByIdToFront = (arr: any[], targetIds: number | number[]) => {
    const idsToTarget = Array.isArray(targetIds) ? targetIds : [targetIds]

    const targetedItems: any[] = []
    const otherItems: any[] = []

    arr.forEach(item => {
        if (idsToTarget.includes(item.id)) {
            targetedItems.push(item)
        } else {
            otherItems.push(item)
        }
    })

    const newArray: any[] = []
    const seenTargetIds = new Set<number>()

    arr.forEach(item => {
        if (idsToTarget.includes(item.id)) {
            newArray.push(item)
            seenTargetIds.add(item.id)
        }
    })

    arr.forEach(item => {
        if (!seenTargetIds.has(item.id)) {
            newArray.push(item)
        }
    })

    return newArray
}

function calculateDuration(item: Travel): string | null {
    if (!item.bus_initial_departure || !item.bus_final_arrival) {
        return null
    }

    const departureDate = new Date(item.bus_initial_departure)
    const arrivalDate = new Date(item.bus_final_arrival)

    if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
        return null
    }

    const durationInMilliseconds = arrivalDate.getTime() - departureDate.getTime()

    if (durationInMilliseconds < 0) {
        return null
    }

    const durationInSeconds = Math.floor(durationInMilliseconds / 1000)
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = durationInSeconds % 60

    let durationString = ''
    if (hours > 0) {
        durationString += `${hours}h`
        if (minutes > 0 || seconds > 0) {
            durationString += ' '
        }
    }
    if (minutes > 0) {
        durationString += `${minutes}m`
        if (seconds > 0) {
            durationString += ' '
        }
    }

    if (durationString === '') {
        return '0m'
    }

    return durationString.trim()
}

const formatDateForDisplay = (isoString: string | undefined | null) => {
    if (!isoString) return 'Select Date/Time...'
    try {
        const date = new Date(isoString)
        if (isNaN(date.getTime())) return 'Invalid Date'

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    } catch (error) {
        console.error("Error formatting date:", isoString, error)
        return 'Invalid Date'
    }
}

export const formatLapTimeDisplay = (isoString: string | undefined | null, timeOnly: boolean = false) => {
    if (!isoString) return undefined
    const cleanTime = isoString.replace("T", " ")
    const formattedDate = moment(cleanTime).format("YYYY-MM-DD")
    const formattedTime = moment(cleanTime).format("HH:mm:ss")

    const timeString = (timeOnly ? '' : `${formattedDate} `) + formattedTime
    return timeString
}

export const padNumber = (num: number) => {
    return String(num).padStart(2, "0")
}

export const datetimeFieldToCapitals = (label: string) => {
    return label.replaceAll('_', ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export {
    calculateDuration,
    formatDateForDisplay, sortByIdToFront
}

