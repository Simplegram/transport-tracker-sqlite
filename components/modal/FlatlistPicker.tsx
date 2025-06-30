import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { CompleteStop, CompleteVehicleType } from "@/src/types/CompleteTravels"
import { formatLapTimeDisplay } from "@/src/utils/utils"
import React from "react"
import { FlatList, Pressable, TouchableOpacity, View, ViewProps } from "react-native"
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated"
import CustomIcon from "../CustomIcon"
import Divider from "../Divider"
import Input from "../input/Input"

export default function FlatlistBase() { }

interface PickerProps {
    items: any[]
    maxHeight?: number
    onSelect: (id: any) => void
    children?: (item: any) => React.ReactNode
}

function PickerFlatlist({ items, maxHeight = 350, onSelect, children }: PickerProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        gap: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,

                        backgroundColor: theme.palette.background,
                        borderBottomColor: theme.palette.borderColorSoft,
                    }}
                    onPress={() => onSelect(item.id)}
                >
                    {children && children(item)}
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps={'always'}
            style={{
                maxHeight: maxHeight
            }}
        />
    )
}

interface PickerItemProps extends ViewProps {
    item: any
}

function PickerItem({ item, children, ...props }: PickerItemProps) {
    return (
        <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
                width: 35,
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                {item.vehicle_type_name ? (
                    <CustomIcon name={item.icon_name.toLocaleLowerCase()} />
                ) : (
                    <CustomIcon name="train" />
                )}
                <Input.ValueText>{item.vehicle_type_name.slice(0, 3)}</Input.ValueText>
            </View>
            <View style={{ gap: 2, flexDirection: 'column' }}>
                {children}
            </View>
        </View>
    )
}

function StopsPickerItem({ item, children, ...props }: PickerItemProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={{ gap: 8, flexDirection: 'column' }}>
            <View style={{ gap: 8, flexDirection: 'row' }}>
                {item.vehicle_types.length > 0 ? (
                    item.vehicle_types.map((type: CompleteVehicleType) => {
                        return (
                            <View style={{ alignItems: 'center', padding: 5, borderColor: theme.palette.borderColor, borderRadius: 10, borderWidth: 1 }}>
                                <CustomIcon name={type.icon_name} />
                                <Input.ValueText>{type.name.slice(0, 3)}</Input.ValueText>
                            </View>
                        )
                    })
                ) : (
                    <CustomIcon name="train" />
                )}
            </View>
            <View style={{ gap: 2, flexDirection: 'column' }}>
                {children}
            </View>
        </View>
    )
}

export interface ManageableLap {
    id: number | string
    travel_id?: number | undefined
    time: string | undefined
    lat: number | undefined
    lon: number | undefined
    stop_id: number | undefined
    note: string | undefined
    status?: string | undefined
}

interface LapProps {
    laps: ManageableLap[]
    stops: CompleteStop[]
    onPress: (key: any) => void
    onRemove: (key: any) => void
}

function LapList({ laps, stops, onPress, onRemove }: LapProps) {
    return (
        <Animated.FlatList
            data={laps}
            keyExtractor={(lap) => lap.id.toString()}
            renderItem={({ item, index }) => (
                <Animated.View
                    key={item.id}
                    entering={(item.status === 'deleted') ? undefined : FadeIn.duration(250)}
                    exiting={(item.status === 'deleted') ? undefined : FadeOut.duration(125)}
                    style={(item.status === 'deleted') && { opacity: 0.4 }}
                >
                    <Pressable
                        style={{
                            alignItems: 'flex-start',
                            borderRadius: 10,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                        onPress={() => onPress(item)}
                    >
                        <View style={{
                            flex: 1,
                            width: '100%',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                            <Input.LabelLight style={{ marginBottom: 5 }}>{formatLapTimeDisplay(item.time)}</Input.LabelLight>
                            {!item.status && (
                                <Input.Remove onPress={() => onRemove(item.id)} />
                            )}
                        </View>
                        {stops.find(stop => stop.id === item.stop_id) ? (
                            <Input.Label style={{ color: colors.primary, marginBottom: 0 }}>
                                {stops.find(stop => stop.id === item.stop_id)?.name}
                            </Input.Label>
                        ) : null}

                        {item.note && (
                            <Input.Label>{item.note}</Input.Label>
                        )}

                    </Pressable>
                    {index < (laps.length - 1) && (
                        <Divider paddingSize={8} />
                    )}
                </Animated.View>
            )}
            itemLayoutAnimation={LinearTransition}
            removeClippedSubviews={false}
            contentContainerStyle={{ gap: 5 }}
        />
    )
}

FlatlistBase.Picker = PickerFlatlist
FlatlistBase.PickerItem = PickerItem
FlatlistBase.StopsPickerItem = StopsPickerItem

FlatlistBase.LapList = LapList