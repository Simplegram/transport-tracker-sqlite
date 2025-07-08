import { CompleteVehicleType } from "@/src/types/CompleteTypes"
import { Stop } from "@/src/types/Types"
import { utcToLocaltime } from "@/src/utils/dateUtils"
import { useState } from "react"
import { View } from "react-native"
import { Pressable } from "react-native-gesture-handler"
import Input from "./input/Input"

interface AnnotationContentProps {
    fullVehicleTypes: CompleteVehicleType[]
    data: any
    title: string
    stop?: Stop | null,
    time: string | null
}

export default function AnnotationContent({ data, title, time }: AnnotationContentProps) {
    const [enableTitle, setEnableTitle] = useState<boolean>(false)

    const formattedTime = time ? utcToLocaltime(time, "HH:mm:ss") : "no time"

    return (
        <Pressable
            style={{
                width: 70,
                alignItems: 'center',
            }}
            onPress={() => {
                setEnableTitle(!enableTitle)
            }}
        >
            {enableTitle && (
                <Pressable onPress={() => setEnableTitle(!enableTitle)}>
                    <Input.Text style={{ fontSize: 10 }}>{formattedTime}</Input.Text>
                </Pressable>
            )}
            <View style={{
                width: 12,
                aspectRatio: 1,

                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 50,

                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor: (data && data.id === "stop") ? 'limegreen' : data.stop.id ? 'orange' : 'yellow'
            }} />
            {enableTitle && (
                <Pressable onPress={() => setEnableTitle(!enableTitle)}>
                    <Input.Text style={{ fontSize: 10, textAlign: 'center' }}>{title}</Input.Text>
                </Pressable>
            )}
        </Pressable>
    )
}