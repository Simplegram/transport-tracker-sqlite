import Button from '@/components/button/BaseButton'
import Input from '@/components/input/Input'
import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import useDirections from '@/hooks/data/useDirections'
import useIcons from '@/hooks/data/useIcons'
import useLaps from '@/hooks/data/useLaps'
import useRides from '@/hooks/data/useRides'
import useRoutes from '@/hooks/data/useRoutes'
import useStops from '@/hooks/data/useStops'
import useStopsVehicleTypes from '@/hooks/data/useStopVehicleTypes'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import { getCurrentTime, utcToLocaltime } from '@/src/utils/dateUtils'
import * as FileSystem from 'expo-file-system'
import { StorageAccessFramework } from 'expo-file-system'
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native'

interface ExportItems {
    label: string
    count: number
}

export default function Export() {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { dialog } = useDialog()

    const { directions, getDirections } = useDirections()
    const { icons, getIcons } = useIcons()
    const { vehicleTypes, getVehicleTypes } = useVehicleTypes()
    const { stops, getStops } = useStops()
    const { stopVehicleTypes, getStopVehicleTypes } = useStopsVehicleTypes()
    const { routes, getRoutes } = useRoutes()
    const { rides, getRides } = useRides()
    const { laps, getLaps } = useLaps()

    const exportData = async () => {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
        if (!permissions.granted) {
            return
        }

        const currentTime = getCurrentTime().toISOString()
        const localCurrentTime = utcToLocaltime(currentTime, "YYYY_MM_DD_hh_mm_ss")
        const filename = `transport_tracker_data_${localCurrentTime}.json`

        const data = {
            "directions": directions,
            "icons": icons,
            "vehicle_types": vehicleTypes,
            "stops": stops,
            "stop_vehicle_types": stopVehicleTypes,
            "routes": routes,
            "rides": rides,
            "laps": laps
        }

        await StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, 'application/json')
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 })
                    .then(() => {
                        dialog("Data successfully exported", `Data successfully exported as ${filename}`)
                    })
            })
    }

    const ExportItems: ExportItems[] = [
        { label: 'Directions', count: directions.length },
        { label: 'Icons', count: icons.length },
        { label: 'Vehicle Types', count: vehicleTypes.length },
        { label: 'Stops', count: stops.length },
        { label: 'Stop Vehicle Types', count: stopVehicleTypes.length },
        { label: 'Routes', count: routes.length },
        { label: 'Rides', count: rides.length },
        { label: 'Laps', count: laps.length }
    ]

    const styles = StyleSheet.create({
        textStyle: {
            borderColor: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.palette.textBlack
        }
    })

    return (
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.palette.background }}>
            <Input.Header style={styles.textStyle}>Export your data into JSON</Input.Header>
            <View style={{ gap: 5, alignItems: 'center' }}>
                {ExportItems.map(exportItem => (
                    <CountItem key={exportItem.label} style={styles.textStyle} label={exportItem.label} count={exportItem.count} />
                ))}
            </View>
            <View style={{ gap: 10 }}>
                <Button.Add onPress={exportData}>Export Data</Button.Add>
            </View>
        </View>
    )
}

interface CountItemProps {
    style: StyleProp<TextStyle>
    label: string
    count: number
}

function CountItem({ style, label, count }: CountItemProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,

            borderColor: theme.palette.borderColor
        }}>
            <Input.Subtitle>{label}</Input.Subtitle>
            <Input.ValueText style={style}>{count.toString()}</Input.ValueText>
        </View>
    )
}