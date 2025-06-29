import LoadingScreen from "@/components/LoadingScreen"
import useDatabase from "@/hooks/useDatabase"
import { router } from "expo-router"
import { useEffect } from "react"
import { Text, View } from "react-native"

export default function Home() {
    const { migrateDb, isMigrating } = useDatabase()

    useEffect(() => {
        migrateDb()
        if (isMigrating === false) router.push('/manage')
    }, [isMigrating])

    return (
        <View style={{ flex: 1 }}>
            {isMigrating ? (
                <LoadingScreen />
            ) : (
                <Text>Hello</Text>
            )}
        </View>
    )
}