import DataButton from '@/components/button/DataButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import { useDataEditContext } from '@/context/DataEditContext'
import useDirections from '@/hooks/data/useDirections'
import { router } from 'expo-router'
// import { useDataEditContext } from '@/context/DataEditContext'
import React, { useEffect } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

interface ButtonConfig {
    id: string
    label: string
    iconName: string
    onPress?: () => void
}

const navigationButtons: ButtonConfig[] = [
    {
        id: 'Stops',
        label: 'Stops',
        iconName: 'location-dot',
    },
    {
        id: 'Routes',
        label: 'Routes',
        iconName: 'route',
    },
    {
        id: 'Icons',
        label: 'Icons',
        iconName: 'icons',
    },
    {
        id: 'Directions',
        label: 'Directions',
        iconName: 'signs-post',
    },
    {
        id: 'VehicleTypes',
        label: 'Vehicle Types',
        iconName: 'truck-plane',
    },
    {
        id: 'Trip Templates',
        label: 'Trip Templates',
        iconName: 'crop-simple',
        onPress: () => router.push("/manage/templatesList")
    },
]


export default function NavigationPage() {
    const { setEditCategory } = useDataEditContext()
    const { getDirections } = useDirections()

    useEffect(() => {
        getDirections()
    }, [])

    const handleItemPress = (editCategory: string) => {
        if (editCategory) {
            setEditCategory(editCategory)
            router.push("/manage/datalist")
        }
    }

    return (
        <CollapsibleHeaderPage
            headerText="Data Manager"
        >
            <View style={styles.container}>
                <View style={styles.fillingContainer} />
                <View style={styles.buttonContainer}>
                    <FlatList
                        data={navigationButtons}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <DataButton
                                key={item.id}
                                label={item.label}
                                iconName={item.iconName}
                                onPress={item.onPress ? item.onPress : () => handleItemPress(item.id)}
                            />
                        )}
                        contentContainerStyle={{ gap: 8 }}
                        columnWrapperStyle={{ gap: 8 }}
                        scrollEnabled={false}
                    />
                </View>
                <Divider />
                <View style={{ gap: 8, flexDirection: 'row' }}>
                    <DataButton
                        label='Import'
                        iconName='download'
                        onPress={() => router.push("/manage/import")}
                    />
                    <DataButton
                        label='Export'
                        iconName='upload'
                        onPress={() => router.push("/manage/export")}
                    />
                </View>
                <DataButton
                    label='Settings'
                    iconName='gear'
                    onPress={() => router.push("/manage/settings")}
                />
            </View>
        </CollapsibleHeaderPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
    fillingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        gap: 10,
    },
})