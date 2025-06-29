import { useTheme } from "@/context/ThemeContext"
import useStopsVehicleTypes from "@/hooks/data/useStopVehicleTypes"
import { TouchableOpacity, View } from "react-native"
import { TouchableOpacityProps } from "react-native-gesture-handler"
import CustomIcon from "../CustomIcon"
import Divider from "../Divider"
import Input from "../input/Input"

export interface ItemTemplate {
    id: string | number
    name: string
    [key: string]: any
}

interface Props extends Omit<TouchableOpacityProps, 'onPress'> {
    name: string
    onPress: (key: any) => void
}

export default function DataButtonBase({ name, onPress, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            style={{
                gap: 10,
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: 'column',
                justifyContent: 'space-between',

                borderColor: theme.palette.borderColor,
                backgroundColor: theme.palette.background,
            }}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                {props.children}
                <View>
                    <Divider />
                    <Input.Subtitle>{name}</Input.Subtitle>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function StopsButton(item: ItemTemplate) {
    const { getStopVehicleTypesById } = useStopsVehicleTypes()
    const stopVehicleTypes = getStopVehicleTypesById(item.id)

    return (
        <View style={{ gap: 4 }}>
            {stopVehicleTypes?.map(item => (
                <View key={`${item.stop_id} - ${item.vehicle_type_id}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Input.SubtitlePrimary>{item.vehicle_type_name?.toString()}</Input.SubtitlePrimary>
                    <CustomIcon name={item.icon_name?.toString() || 'truck-plane'} />
                </View>
            ))}
        </View>
    )
}

function RoutesButton(item: ItemTemplate) {
    return (
        <>
            <CustomIcon name={item.icon_name || 'truck-plane'} />
            <Input.SubtitlePrimary>{item.code}</Input.SubtitlePrimary>
        </>
    )
}

DataButtonBase.Stops = StopsButton
DataButtonBase.Routes = RoutesButton