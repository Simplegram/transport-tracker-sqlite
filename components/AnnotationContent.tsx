import { CompleteVehicleType } from "@/src/types/CompleteTravels"
import { Stop } from "@/src/types/Travels"
import { utcToLocaltime } from "@/src/utils/dateUtils"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import Input from "./input/Input"

interface AnnotationContentProps {
    fullVehicleTypes: CompleteVehicleType[]
    data_id: string
    title: string
    stop: Stop | null,
    time: string | null
}

export default function AnnotationContent({ fullVehicleTypes, data_id, title, stop, time }: AnnotationContentProps) {
    const [enableTitle, setEnableTitle] = useState<boolean>(false)

    // const formattedTime = time ? moment(time.replace("T", " "), "yyyy-mm-dd HH:mm:ss").format("HH:mm:ss") : "no time"
    const formattedTime = time ? utcToLocaltime(time, "HH:mm:ss") : "no time"

    return (
        <View style={{
            width: 70,
            alignItems: 'center',
        }}>
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
                onPress={() => {
                    console.log('masuk')
                    setEnableTitle(!enableTitle)
                }}
                activeOpacity={1}
            >
                <View style={{
                    width: 12,

                    aspectRatio: 1,
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 10,

                    alignItems: 'center',
                    justifyContent: 'center',

                    backgroundColor: data_id === "stop" ? 'limegreen' : 'yellow'
                }}>
                </View>
            </TouchableOpacity>
            {enableTitle && (
                <TouchableOpacity onPress={() => setEnableTitle(!enableTitle)}>
                    <Input.Text style={{ fontSize: 10, textAlign: 'center' }}>{title}</Input.Text>
                </TouchableOpacity>
            )}
        </View>
    )
}