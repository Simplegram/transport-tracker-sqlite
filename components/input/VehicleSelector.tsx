import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { CompleteVehicleType } from "@/src/types/CompleteTravels"
import { IconType } from "@/src/types/Travels"
import { TouchableOpacity } from "react-native"
import CustomIcon from "../CustomIcon"
import Input from "./Input"

interface VehicleSelectorProps {
    type: CompleteVehicleType
    condition: boolean
    onPress: (key: any) => void
}

export default function VehicleSelector({ type, condition, onPress }: VehicleSelectorProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            style={[
                {
                    width: 75,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingTop: 10,
                    flexDirection: 'column',
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',

                    borderColor: theme.palette.borderColorSoft,
                },
                condition && {
                    borderColor: colors.primary,
                    backgroundColor: theme.palette.background,
                },
            ]}
            onPress={onPress}
        >
            <CustomIcon.Switch
                condition={condition}
                name={type.icon_name}
            />
            <Input.Label style={condition && { color: theme.palette.textPrimary }}>{type.name.slice(0, 5)}</Input.Label>
        </TouchableOpacity>
    )
}

interface IconSelectorProps {
    icon: IconType
    condition: boolean
    onPress: (key: any) => void
}

export function IconSelector({ icon, condition, onPress }: IconSelectorProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            style={[
                {
                    minWidth: 55,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingVertical: 5,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',

                    borderColor: theme.palette.borderColorSoft,
                },
                condition && {
                    borderColor: colors.primary,
                    backgroundColor: theme.palette.background,
                },
            ]}
            onPress={onPress}
        >
            <CustomIcon.Switch
                condition={condition}
                name={icon.name}
            />
        </TouchableOpacity>
    )
}