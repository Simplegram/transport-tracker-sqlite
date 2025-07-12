import Button from '@/components/button/BaseButton'
import Input from '@/components/input/Input'
import { useDialog } from '@/context/DialogContext'
import { useSettings } from '@/context/SettingsContext'
import { useTheme } from '@/context/ThemeContext'
import useLapTemplates from '@/hooks/data/templates/useLapTemplates'
import useRideTemplates from '@/hooks/data/templates/useRideTemplates'
import useTripTemplates from '@/hooks/data/templates/useTripTemplates'
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
import { FlatList, StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ExportItems {
    label: string
    count: number
}

export default function Export() {
    const { theme: currentTheme, getTheme } = useTheme()
    const theme = getTheme()

    const {
        enableVibration,
        travelDisplayMode,
        directLapSave,
        directRideLapSave
    } = useSettings()

    const { dialog } = useDialog()

    const { directions, getDirections } = useDirections()
    const { icons, getIcons } = useIcons()
    const { vehicleTypes, getVehicleTypes } = useVehicleTypes()
    const { stops, getStops } = useStops()
    const { stopVehicleTypes, getStopVehicleTypes } = useStopsVehicleTypes()
    const { routes, getRoutes } = useRoutes()
    const { rides, getRides } = useRides()
    const { laps, getLaps } = useLaps()

    const { tripTemplates } = useTripTemplates()
    const { rideTemplates } = useRideTemplates()
    const { lapTemplates } = useLapTemplates()

    const exportData = async () => {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
        if (!permissions.granted) {
            return
        }

        const currentTime = getCurrentTime().toISOString()
        const localCurrentTime = utcToLocaltime(currentTime, "YYYY_MM_DD_hh_mm_ss")
        const filename = `transport_tracker_data_${localCurrentTime}.json`

        const data = {
            "data": {
                "directions": directions,
                "icons": icons,
                "vehicle_types": vehicleTypes,
                "stops": stops,
                "stop_vehicle_types": stopVehicleTypes,
                "routes": routes,
                "rides": rides,
                "laps": laps,
                "templates": {
                    "trip_templates": tripTemplates,
                    "ride_templates": rideTemplates,
                    "lap_templates": lapTemplates
                }
            },
            "settings": {
                enableVibration: enableVibration,
                travelDisplayMode: travelDisplayMode,
                theme: currentTheme,
                directLapSave: directLapSave,
                directRideLapSave: directRideLapSave
            }
        }

        await StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, 'application/json')
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 })
                    .then(() => {
                        dialog("Data successfully exported", `Data successfully exported as ${filename}`)
                    })
            })
    }

    const exportItems: ExportItems[] = [
        { label: 'Directions', count: directions.length },
        { label: 'Icons', count: icons.length },
        { label: 'Stops', count: stops.length },
        { label: 'Routes', count: routes.length },
        { label: 'Rides', count: rides.length },
        { label: 'Laps', count: laps.length },
        { label: 'Vehicle Types', count: vehicleTypes.length },
        { label: 'Trip Templates', count: tripTemplates.length },
        { label: 'Ride Templates', count: rideTemplates.length },
        { label: 'Lap Templates', count: lapTemplates.length },
        { label: 'Stop Vehicle Types', count: stopVehicleTypes.length },
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
        <View style={{
            flex: 1,
            paddingBottom: 15,
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: theme.palette.background
        }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Input.Header style={styles.textStyle}>Export your data into JSON</Input.Header>
                <FlatList
                    data={exportItems}
                    renderItem={({ item }) => (
                        <CountItem key={item.label} style={styles.textStyle} label={item.label} count={item.count} />
                    )}
                    numColumns={2}
                    contentContainerStyle={{ gap: 5, flex: 1, justifyContent: 'center' }}
                    columnWrapperStyle={{ gap: 5 }}
                />
                <View style={{ gap: 10 }}>
                    <Button.Add onPress={exportData}>Export Data</Button.Add>
                </View>
            </SafeAreaView>
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
            flex: 1,
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            justifyContent: 'space-between',
            paddingVertical: 5,
            paddingHorizontal: 10,

            borderColor: theme.palette.borderColor
        }}>
            <Input.SubtitlePrimary style={{ textAlign: 'center' }}>{label}</Input.SubtitlePrimary>
            <Input.ValueText style={style}>{count.toString()}</Input.ValueText>
        </View>
    )
}