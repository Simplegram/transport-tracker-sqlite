import { useTheme } from "@/context/ThemeContext"
import { Image, Pressable, View } from "react-native"
import Input from "./Input"

interface PickerItemProps {
    imagePath: any
    label: string
    selected: boolean
    onPress: () => void
}

export function PickerItem({ imagePath, label, selected = false, onPress }: PickerItemProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Pressable
            style={{
                flex: 1,
                height: 200,
            }}
            onPress={onPress}
        >
            <Image style={{
                width: '100%',
                maxHeight: 150,
            }} resizeMode="contain" source={imagePath} />
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Input.Label>{label}</Input.Label>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={[{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderRadius: 50,

                        borderColor: selected ? theme.palette.textPrimary : theme.palette.borderColor,
                    }]} />
                    {selected && (
                        <View style={{
                            width: 13,
                            height: 13,
                            position: 'absolute',
                            borderWidth: 1,
                            borderRadius: 50,

                            borderColor: theme.palette.textPrimary,
                            backgroundColor: theme.palette.textPrimary,
                        }} />
                    )}
                </View>
            </View>
        </Pressable>
    )
}