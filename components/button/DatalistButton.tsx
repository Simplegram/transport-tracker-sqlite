import { useTheme } from "@/context/ThemeContext"
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
            <View style={{ flexDirection: 'column' }}>
                {props.children}
                <Input.Subtitle>{name}</Input.Subtitle>
            </View>
        </TouchableOpacity>
    )
}

function StopsButton(item: ItemTemplate) {
    return (
        <>
            <CustomIcon name={item.vehicle_type?.icon_id.name} />
            <Input.SubtitlePrimary>{item.vehicle_type?.name}</Input.SubtitlePrimary>
        </>
    )
}

function RoutesButton(item: ItemTemplate) {
    return (
        <>
            <CustomIcon name={item.vehicle_type?.icon_id.name} />
            <Input.SubtitlePrimary>{item.code}</Input.SubtitlePrimary>
        </>
    )
}

DataButtonBase.Stops = StopsButton
DataButtonBase.Routes = RoutesButton