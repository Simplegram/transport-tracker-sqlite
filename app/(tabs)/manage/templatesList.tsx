import Button from "@/components/button/BaseButton"
import DataButtonBase from "@/components/button/DatalistButton"
import Container from "@/components/Container"
import Divider from "@/components/Divider"
import Input from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import AddTripTemplate from "@/components/modal/templates/AddTripTemplate"
import EditTripTemplate from "@/components/modal/templates/EditTripTemplate"
import { EmptyHeaderComponent } from "@/components/ride/RidesFlatlist"
import { useDialog } from "@/context/DialogContext"
import { useTemplateContext } from "@/context/TemplateContext"
import useTripTemplates from "@/hooks/data/templates/useTripTemplates"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { AddableTripTemplate, EditableTripTemplate, TripTemplate } from "@/src/types/data/TripTemplates"
import { useState } from "react"
import { View } from "react-native"
import { FlatList } from "react-native-gesture-handler"

export default function TripTemplates() {
    const { tripTemplateId, setTripTemplateId } = useTemplateContext()
    const { dialog } = useDialog()
    const { loading } = useLoading()

    const {
        tripTemplates,
        getTripTemplates,
        insertTripTemplate,
        editTripTemplate,
        deleteTripTemplate
    } = useTripTemplates()

    const {
        showModal: showTripTemplateModal,
        openModalWithSearch: openTripTemplateModal,
        closeModal: closeTripTemplateModal
    } = useModalHandler()

    const {
        showModal: showEditTripTemplate,
        openModalWithSearch: openEditTripTemplate,
        closeModal: closeEditTripTemplate
    } = useModalHandler()

    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleEditTripTemplate = (id: number) => {
        setTripTemplateId(id)
        openEditTripTemplate()
    }

    const renderItem = (item: TripTemplate) => (
        <DataButtonBase.TripTemplateButton
            onPress={() => handleEditTripTemplate(item.id)}
        >
            <Input.Subtitle>{item.name}</Input.Subtitle>
            <Input.ValueText>{item.description}</Input.ValueText>
        </DataButtonBase.TripTemplateButton>
    )

    const handleTripTemplateSave = (tripTemplate: AddableTripTemplate) => {
        insertTripTemplate(tripTemplate)

        getTripTemplates()
        closeTripTemplateModal()
        dialog('Trip Template Added', `Trip template "${tripTemplate.name}" has been saved.`)
    }

    const handleTripTemplateEdit = (tripTemplate: EditableTripTemplate) => {
        editTripTemplate(tripTemplate)

        getTripTemplates()
        closeEditTripTemplate()
        dialog('Trip Template Changes Saved', `Changes of trip template "${tripTemplate.name}" has been saved.`)
    }

    return (
        <Container style={{ flex: 1 }}>
            {tripTemplates.length === 0 ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Input.Title>No trip templates available to display</Input.Title>
                </View>
            ) : (
                <FlatList
                    refreshing={loading}
                    onRefresh={getTripTemplates}
                    data={tripTemplates}
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
                placeholder={`Search...`}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery('')}
            />

            <AddTripTemplate
                isModalVisible={showTripTemplateModal}
                onSubmit={handleTripTemplateSave}
                onClose={closeTripTemplateModal}
            />

            {tripTemplateId && (
                <EditTripTemplate
                    isModalVisible={showEditTripTemplate}
                    tripTemplateId={tripTemplateId}
                    onSubmit={handleTripTemplateEdit}
                    onClose={closeEditTripTemplate}
                />
            )}

            <Button.Row>
                <Button.Add onPress={() => openTripTemplateModal()}>Add New Template</Button.Add>
            </Button.Row>
        </Container>
    )
}