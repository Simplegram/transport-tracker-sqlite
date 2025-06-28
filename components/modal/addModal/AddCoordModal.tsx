import Button from "@/components/button/BaseButton"
import MapDisplay from "@/components/MapDisplay"
import ModalTemplate from "@/components/ModalTemplate"
import { useDialog } from "@/context/DialogContext"
import useLocation from "@/hooks/useLocation"
import { AddableCoordModalProp } from "@/src/types/AddableTravels"
import { LocationObject } from "expo-location"
import { useEffect, useRef, useState } from "react"

export default function AddCoordModal({ currentCoordinates, isModalVisible, onClose, onSelect }: AddableCoordModalProp) {
    const { dialog } = useDialog()

    const mapRef = useRef(null)

    const { location } = useLocation()
    const [userLocation, setUserLocation] = useState<LocationObject | null>(null)

    useEffect(() => {
        setUserLocation(location)
    }, [location])

    const getInitialCameraState = () => {
        if (currentCoordinates?.lon && currentCoordinates?.lat) {
            return {
                centerCoordinate: [currentCoordinates.lon, currentCoordinates.lat],
                zoomLevel: 15
            }
        } else if (userLocation) {
            return {
                centerCoordinate: [userLocation.coords.longitude, userLocation.coords.latitude],
                zoomLevel: 14
            }
        } else {
            return {
                centerCoordinate: [0, 0],
                zoomLevel: 0
            }
        }
    }

    const { centerCoordinate, zoomLevel } = getInitialCameraState()

    const handleOnSubmit = async () => {
        const currentMapRef = mapRef.current

        if (currentMapRef === null) {
            dialog('MapRef not available', 'There is a problem obtaining current map ref')
            return
        }

        const currentCoordinates = await currentMapRef.getCenter()
        const roundedCoordinate = {
            lon: Number(currentCoordinates[0].toFixed(6)),
            lat: Number(currentCoordinates[1].toFixed(6))
        }

        onSelect(roundedCoordinate)
    }

    return (
        <ModalTemplate.Bottom visible={isModalVisible}>
            <ModalTemplate.BottomContainer style={{ height: 475 }}>
                <MapDisplay.Pin
                    mapRef={mapRef}
                    zoomLevel={zoomLevel}
                    centerCoordinate={centerCoordinate}
                />

                <Button.Row>
                    <Button.Dismiss label='Cancel' onPress={onClose} />
                    <Button.Add label='Pick Coordinate' onPress={handleOnSubmit} />
                </Button.Row>
            </ModalTemplate.BottomContainer>
        </ModalTemplate.Bottom>
    )
}