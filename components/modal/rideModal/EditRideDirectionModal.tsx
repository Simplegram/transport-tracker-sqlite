import Input from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useTheme } from "@/context/ThemeContext"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { EditableRideDirectionModalProp } from "@/src/types/EditableTypes"
import { useMemo } from "react"
import { Pressable, View } from "react-native"
import FlatlistBase from "../FlatlistPicker"

export default function EditRideDirectionModal({ directions, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableRideDirectionModalProp) {
    const { theme } = useTheme()

    const filteredItems = useMemo(() => {
        if (!directions) return []
        const query = searchQuery.toLowerCase()
        return directions.filter(direction =>
            direction.name.toLowerCase().includes(query)
        )
    }, [directions, searchQuery])

    return (
        <ModalTemplate.Bottom
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            <ModalTemplate.BottomContainer>
                <View style={modalElementStyles[theme].header}>
                    <Input.Header>Select a direction</Input.Header>
                    <Pressable onPress={onClose}>
                        <Input.Subtitle>Close</Input.Subtitle>
                    </Pressable>
                </View>
                <TextInputBase.Clear
                    value={searchQuery}
                    placeholder="Search direction..."
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                />
                {filteredItems.length === 0 ? (
                    <View style={modalStyles[theme].emptyList}>
                        <Input.Label>No route found</Input.Label>
                    </View>
                ) : (
                    <FlatlistBase.Picker
                        items={filteredItems}
                        onSelect={onSelect}
                    >
                        {(item) => (
                            <Input.Label>{item.name}</Input.Label>
                        )}
                    </FlatlistBase.Picker>
                )}
            </ModalTemplate.BottomContainer>
        </ModalTemplate.Bottom>
    )
}