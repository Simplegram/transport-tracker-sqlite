import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { Camera, MapView } from "@maplibre/maplibre-react-native"
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

const pointSize = {
    width: 8,
    height: 8
}

interface MapDisplayProps {
    mapRef?: React.MutableRefObject<null>

    zoomLevel: number
    centerCoordinate: number[]

    zoomEnabled?: boolean
    rotateEnabled?: boolean
    scrollEnabled?: boolean

    children?: React.ReactNode
}

export default function MapDisplay({
    mapRef,

    zoomLevel,
    centerCoordinate,

    zoomEnabled = true,
    rotateEnabled = false,
    scrollEnabled = true,

    children
}: MapDisplayProps) {
    const { theme } = useTheme()

    return (
        <MapView
            ref={mapRef}

            zoomEnabled={zoomEnabled}
            rotateEnabled={rotateEnabled}
            scrollEnabled={scrollEnabled}

            style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}
            mapStyle={((theme === 'light') || (!process.env.EXPO_PUBLIC_MAP_STYLE_DARK)) ? process.env.EXPO_PUBLIC_MAP_STYLE : process.env.EXPO_PUBLIC_MAP_STYLE_DARK}
        >
            {children}
            <Camera
                zoomLevel={zoomLevel}
                centerCoordinate={centerCoordinate}
                animationMode={"moveTo"}
            />
        </MapView>
    )
}

interface PinProps extends MapDisplayProps {
    locationLoading?: boolean
    updateLocation?: () => void
}

export function Pin(props: PinProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { updateLocation, ...restProps } = props

    return (
        <View style={{ flex: 1 }}>
            <MapDisplay {...restProps} />
            <View style={styles.pointContainer}>
                <View style={styles.point} />
            </View>
            {updateLocation && (
                <TouchableOpacity
                    disabled={props.locationLoading}
                    style={{
                        width: 42,
                        aspectRatio: 1,

                        right: 5,
                        bottom: 5,
                        position: 'absolute',

                        alignItems: 'center',
                        justifyContent: 'center',

                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 50,
                        backgroundColor: theme.name === 'light' ? colors.white_200 : colors.white_800,

                        overflow: 'hidden',
                        pointerEvents: 'box-none',
                    }}
                    onPress={updateLocation}
                    activeOpacity={0.7}
                >
                    {props.locationLoading ? (
                        <ActivityIndicator color={theme.palette.textBlack} />
                    ) : (
                        <Icon name="location-crosshairs" style={{ color: theme.palette.textBlack }} size={24} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    pointContainer: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'box-none',
    },
    point: {
        width: pointSize.width,
        height: pointSize.height,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: 'red',
    },
})

MapDisplay.Pin = Pin