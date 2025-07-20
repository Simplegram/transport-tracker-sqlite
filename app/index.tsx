import Container from "@/components/Container"
import { useTheme } from "@/context/ThemeContext"
import useDatabase from "@/hooks/useDatabase"
import { colors } from "@/src/const/color"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useEffect } from "react"
import { Image, StatusBar } from "react-native"

export default function Home() {
    const { theme } = useTheme()
    const { migrateDb, isMigrating, isLatestMigration } = useDatabase()

    useEffect(() => {
        migrateDb()
    }, [])

    useEffect(() => {
        if (isMigrating === false) router.push('/main')
    }, [isMigrating])

    useFocusEffect(
        useCallback(() => {
            if (isLatestMigration) router.push('/main')
        }, [isLatestMigration])
    )

    return (
        <Container style={{ flex: 1 }}>
            <StatusBar backgroundColor={theme === 'light' ? colors.white_100 : colors.black} />
            {isMigrating ? (
                <Image
                    style={{
                        width: 50,
                        height: 50,
                    }}
                    source={require('@/assets/images/icon_transparent.png')}
                />
            ) : (
                <></>
            )}
        </Container>
    )
}