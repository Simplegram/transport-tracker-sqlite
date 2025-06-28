import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { timeCase } from "@/src/const/timeCase"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { datetimeFieldToCapitals } from "@/src/utils/utils"
import { TouchableOpacity, View } from "react-native"
import Input from "../input/Input"

interface TypeButtonProps {
    onPress: () => void
    label: React.ReactNode
    typeSelected: boolean
}

export default function TypeButton({ label, onPress, typeSelected }: TypeButtonProps) {
    const { theme: oldTheme, getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                {
                    flex: 1,
                    padding: 10,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    flexDirection: 'column',
                    justifyContent: 'space-between',

                    borderColor: colors.white_500
                },
                typeSelected && { borderColor: oldTheme === 'light' ? colors.black : colors.white_200 }
            ]}
            onPress={onPress}
        >
            <Input.ValueText
                style={[{ color: colors.white_500 }, typeSelected && { color: oldTheme === 'light' ? colors.black : colors.white_200 }]}
            >{label}</Input.ValueText>
        </TouchableOpacity>
    )
}

interface ButtonBlockProps {
    type: string
    onPress: (key: any) => void
}

function TypeButtonBlock({ type, onPress }: ButtonBlockProps) {
    return (
        <View style={{ gap: 10, flexDirection: 'row' }}>
            {timeCase.map((time) => (
                <TypeButton
                    key={time}
                    label={datetimeFieldToCapitals(time)}
                    onPress={() => onPress(time)}
                    typeSelected={type === time}
                />
            ))}
        </View>
    )
}

TypeButton.Block = TypeButtonBlock