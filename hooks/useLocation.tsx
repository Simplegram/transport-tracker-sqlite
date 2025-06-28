import { useDialog } from "@/context/DialogContext"
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from "react" // Added useCallback and useRef

export default function useLocation() {
    const { dialog } = useDialog()

    const [location, setLocation] = useState<Location.LocationObject | null>(null)

    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)

    const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false)

    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null)

    const warmUpTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

    const stopLocationWatch = useCallback(async () => {
        if (locationSubscriptionRef.current) {
            console.log('Stopping warm-up location watch.')
            locationSubscriptionRef.current.remove() // This removes the listener
            locationSubscriptionRef.current = null
        }
    }, [])

    const getCurrentLocation = useCallback(async () => {
        setIsLoadingLocation(true)

        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            dialog('Location access denied', 'Permission to access location was denied.')
            setHasLocationPermission(false)
            setIsLoadingLocation(false)
            return
        }
        setHasLocationPermission(true)

        try {
            console.log('Getting current location with high accuracy...')
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.LocationAccuracy.BestForNavigation
            })
            setLocation(currentLocation)
            console.log('Current location obtained:', currentLocation.coords.latitude)
        } catch (error) {
            console.error('Error getting current location:', error)
            dialog('Error', 'Could not retrieve location. Please try again.')
            setLocation(null)
        } finally {
            setIsLoadingLocation(false)
        }
    }, [dialog, stopLocationWatch])

    useEffect(() => {
        const warmUpAndStop = async () => {
            console.log('Starting location warm-up sequence...')
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.warn('Location warm-up skipped: Permissions not granted.')
                setHasLocationPermission(false)
                return
            }
            setHasLocationPermission(true)

            try {
                console.log('Starting low-accuracy watch for warm-up...')
                locationSubscriptionRef.current = await Location.watchPositionAsync(
                    {
                        accuracy: Location.LocationAccuracy.BestForNavigation,
                        timeInterval: 500,
                        distanceInterval: 0,
                    },
                    (loc) => { }
                )
            } catch (error) {
                console.error('Error during location warm-up:', error)
            }
        }

        warmUpAndStop()

        return () => {
            console.log('Cleaning up location hook: Clearing timeout and stopping watch.')
            if (warmUpTimeoutIdRef.current) {
                clearTimeout(warmUpTimeoutIdRef.current)
                warmUpTimeoutIdRef.current = null
            }
            stopLocationWatch()
        }
    }, [stopLocationWatch])

    const refetchLocation = useCallback(() => {
        getCurrentLocation()
    }, [getCurrentLocation])

    return {
        location,
        refetchLocation,
        isLoadingLocation,
        hasLocationPermission
    }
}