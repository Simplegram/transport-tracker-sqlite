import { ModalButton } from '@/components/button/ModalButton'
import Input from '@/components/input/Input'
import { useTheme } from '@/context/ThemeContext'
import useExportImport from '@/hooks/useExportImport'
import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system/next'
import { useState } from 'react'
import { View } from 'react-native'

export default function Import() {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { importData } = useExportImport()

    const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset>()
    const [text, setText] = useState<string>('hello')

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json'
            })

            if (!result.canceled) {
                const successResult = result as DocumentPicker.DocumentPickerSuccessResult

                setSelectedDocuments(successResult.assets[0])

                const file = new File(successResult.assets[0].uri)
                const data = JSON.parse(file.text())
                console.log(Object.keys(data).toString())
                setText(Object.keys(data).toString())

                console.log(importData(data))
            } else {
                console.log("Document selection cancelled.")
            }
        } catch (error) {
            console.log("Error picking documents:", error)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.palette.background }}>
            <Input.Header style={{ borderColor: 'black', fontWeight: 'bold', textAlign: 'center', color: theme.palette.textBlack }}>Import your JSON data</Input.Header>
            <ModalButton
                condition={selectedDocuments}
                value={selectedDocuments ? selectedDocuments.name : 'none'}
                onPress={pickDocuments}
                style={{ width: 200 }}
            />
        </View>
    )
}