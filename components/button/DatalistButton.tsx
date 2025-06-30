import { useTheme } from "@/context/ThemeContext"
import { CompleteVehicleType } from "@/src/types/CompleteTravels"
import { TouchableOpacity, View } from "react-native"
import { TouchableOpacityProps } from "react-native-gesture-handler"
import CustomIcon from "../CustomIcon"
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
                <Input.Subtitle>{name}</Input.Subtitle>
            </View>
        </TouchableOpacity>
    )
}

function StopsButton(item: ItemTemplate) {
    return (
        <View style={{ gap: 4, minHeight: 100 }}>
            {item.vehicle_types.map((type: CompleteVehicleType) => (
                <View key={`${item.id} - ${type.id}`} style={{ gap: 8, flexDirection: 'row' }}>
                    <View style={{
                        width: 25,
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <CustomIcon name={type.icon_name?.toString() || 'truck-plane'} />
                    </View>
                    <Input.SubtitlePrimary>{type.name?.toString()}</Input.SubtitlePrimary>
                </View>
            ))}
        </View>
    )
}

function RoutesButton(item: ItemTemplate) {
    return (
        <>
            <CustomIcon name={item.vehicle_type.icon_name || 'truck-plane'} />
            <Input.SubtitlePrimary>{item.code}</Input.SubtitlePrimary>
        </>
    )
}

DataButtonBase.Stops = StopsButton
DataButtonBase.Routes = RoutesButton