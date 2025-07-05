import Button from '@/components/button/BaseButton'
import DataButtonBase, { ItemTemplate } from '@/components/button/DatalistButton'
import Container from '@/components/Container'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBase } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import ModalTemplate from '@/components/ModalTemplate'
import { EmptyHeaderComponent } from '@/components/ride/TravelFlatlist'
import { useDataEditContext } from '@/context/DataEditContext'
import { useDialog } from '@/context/DialogContext'
import useDirections from '@/hooks/data/useDirections'
import useIcons from '@/hooks/data/useIcons'
import useRoutes from '@/hooks/data/useRoutes'
import useStops from '@/hooks/data/useStops'
import useStopsVehicleTypes from '@/hooks/data/useStopVehicleTypes'
import useVehicleTypes from '@/hooks/data/useVehicleTypes'
import useDataList from '@/hooks/datalist/useDataList'
import useDatalistModal from '@/hooks/datalist/useDatalistModal'
import { useLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import React from 'react'
import { FlatList, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function DataListScreen() {
    const { dialog, setShowDialog } = useDialog()

    const { setModalData } = useDataEditContext()

    const { directions, getDirections } = useDirections()
    const { completeStops: stops, getCompleteStops } = useStops()
    const { completeRoutes: routes, getCompleteRoutes } = useRoutes()
    const { completeVehicleTypes: vehicleTypes, getCompleteVehicleTypes } = useVehicleTypes()
    const { icons, getIcons } = useIcons()
    const { completeStopVehicleTypes: stopVehicleTypes, getStopVehicleTypes } = useStopsVehicleTypes()

    const refetchData = async () => {
        getIcons()
        getDirections()

        getCompleteStops()
        getCompleteRoutes()
        getStopVehicleTypes()
        getCompleteVehicleTypes()
    }

    const {
        dataType,
        filteredData: data,
        searchQuery, setSearchQuery,
    } = useDataList({ directions, stops, stopVehicleTypes, routes, vehicleTypes, icons })

    const {
        showModal,
        openModal, closeModal
    } = useModalHandler()

    const {
        activeModalConfig,
        setActiveModal, setActiveEditModal
    } = useDatalistModal(refetchData)

    const {
        loading
    } = useLoading()

    const handleModify = (item: ItemTemplate) => {
        if (dataType) setActiveEditModal(dataType)
        setModalData(item)
        openModal()
    }

    const handleAddNew = () => {
        if (dataType) setActiveModal(dataType)
        openModal()
    }

    const handleDelete = (item: any) => {
        if (activeModalConfig?.onDelete) {
            dialog("Delete Confirmation", `Are you sure to delete "${item.name}"?`,
                [
                    { text: 'Cancel', type: 'dismiss', onPress: () => setShowDialog(false) },
                    {
                        text: 'Confirm', type: 'cancel', onPress: () => {
                            activeModalConfig.onDelete(item)
                            setShowDialog(false)
                            closeModal()
                        }
                    }
                ]
            )
        }
    }

    const handleSubmitFromModal = (data: any) => {
        if (activeModalConfig?.onSubmitDataHandler) {
            activeModalConfig.onSubmitDataHandler(data)
        } else {
            console.error("No data handler defined for this modal config.")
            dialog("Error", "Configuration error: Could not process data.")
        }
        closeModal()
    }

    const renderItem = (item: ItemTemplate) => (
        <DataButtonBase
            name={item.name}
            onPress={() => handleModify(item)}
        >
            {dataType === "Stops" ? (
                <DataButtonBase.Stops {...item} />
            ) : null}
            {dataType === "Routes" ? (
                <DataButtonBase.Routes {...item} />
            ) : null}
        </DataButtonBase>
    )

    const ModalContentComponent = activeModalConfig?.content

    return (
        <Container style={{ flex: 1 }}>
            {!dataType || !data ? (
                <LoadingScreen />
            ) : (
                <>
                    {data.length === 0 ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Input.Title>No {dataType} available to display</Input.Title>
                        </View>
                    ) : (
                        <FlatList
                            refreshing={loading}
                            onRefresh={getDirections}
                            data={data}
                            renderItem={({ item }) => renderItem(item)}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={{
                                gap: 8,
                                flexGrow: 1,
                            }}
                            columnWrapperStyle={{ gap: 8 }}
                            keyboardShouldPersistTaps={'always'}
                            ListHeaderComponent={EmptyHeaderComponent}
                            ListHeaderComponentStyle={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                        />
                    )}

                    <Divider />

                    <TextInputBase.Clear
                        value={searchQuery}
                        placeholder={`Search ${dataType}...`}
                        onChangeText={setSearchQuery}
                        onClear={() => setSearchQuery('')}
                    />

                    <Button.Row>
                        <Button.Add label={`Add New ${dataType.slice(0, -1)}`} onPress={handleAddNew} />
                    </Button.Row>

                    <ModalTemplate.Bottom
                        visible={showModal}
                        onRequestClose={closeModal}
                    >
                        <ModalTemplate.BottomContainer>
                            <KeyboardAwareScrollView contentContainerStyle={{ gap: 10 }} keyboardShouldPersistTaps={'always'}>
                                <Input.Header>{activeModalConfig ? activeModalConfig.title : 'Modal'}</Input.Header>
                                {ModalContentComponent ? (
                                    <ModalContentComponent
                                        stops={stops}
                                        icons={icons}
                                        onSubmit={handleSubmitFromModal}
                                        onDelete={handleDelete}
                                        onCancel={closeModal}
                                    />
                                ) : (
                                    <Input.LoadingLabel />
                                )}
                            </KeyboardAwareScrollView>
                        </ModalTemplate.BottomContainer>
                    </ModalTemplate.Bottom>
                </>
            )}
        </Container>
    )
}