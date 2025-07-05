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
import { View } from 'react-native'

export default function Import() {
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

    return (
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.palette.background }}>
            <Input.Header style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>Export your data into JSON</Input.Header>
            <View>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Directions: ${directions.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Icons: ${icons.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Vehicle Types: ${vehicleTypes.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Stops: ${stops.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Stop Vehicle Types: ${stopVehicleTypes.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Routes: ${routes.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Rides: ${rides.length}`}
                </Input.ValueText>
                <Input.ValueText style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>
                    {`Laps: ${laps.length}`}
                </Input.ValueText>
            </View>
            <View style={{ gap: 10 }}>
                <Button.Add onPress={exportData}>Export Data</Button.Add>
            </View>
        </View>
    )
}