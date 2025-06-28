import { Stop, VehicleType } from "@/src/types/Travels"
import moment from "moment"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import Input from "./input/Input"

interface AnnotationContentProps {
    fullVehicleTypes: VehicleType[]
    data_id: string
    title: string
    stop: Stop | null,
    time: string | null
}

export default function AnnotationContent({ fullVehicleTypes, data_id, title, stop, time }: AnnotationContentProps) {
    const [enableTitle, setEnableTitle] = useState<boolean>(false)

    const formattedTime = time ? moment(time.replace("T", " "), "yyyy-mm-dd HH:mm:ss").format("HH:mm:ss") : "no time"

    return (
        <TouchableOpacity style={{
            width: 70,
            alignItems: 'center',
        }} disabled={true}>
            {enableTitle && (
                <TouchableOpacity onPress={() => setEnableTitle(!enableTitle)}>
                    <Input.Text style={{ fontSize: 10 }}>{formattedTime}</Input.Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={{
                    width: 21,
                    aspectRatio: 1,
                    borderRadius: 10,

                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => setEnableTitle(!enableTitle)}
                activeOpacity={1}
            >
                <View style={{
                    width: stop ? 21 : 12,

                    aspectRatio: 1,
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 10,

                    alignItems: 'center',
                    justifyContent: 'center',

                    backgroundColor: data_id === "stop" ? 'limegreen' : 'yellow'
                }}>
                    {stop && (
                        <Icon size={12} name={fullVehicleTypes.find(type => type.id === Number(stop.vehicle_type))?.icon_id.name || 'truck-plane'} />
                    )}
                </View>
            </TouchableOpacity>
            {enableTitle && (
                <TouchableOpacity onPress={() => setEnableTitle(!enableTitle)}>
                    <Input.Text style={{ fontSize: 10, textAlign: 'center' }}>{title}</Input.Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}