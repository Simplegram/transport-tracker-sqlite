import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage"
import Divider from "@/components/Divider"
import Input from "@/components/input/Input"
import { PickerItem } from "@/components/input/Picker"
import Switcher from "@/components/input/Switcher"
import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { StyleSheet, View } from "react-native"

const localAssets = {
    display_card: require('../../../assets/images/display_card.png'),
    display_list: require('../../../assets/images/display_list.png'),
}

var pack = require('@/app.config')

export default function Settings() {
    const {
        theme, setTheme
    } = useTheme()

    const {
        enableVibration, setEnableVibration,
        travelDisplayMode, setTravelDisplayMode,
    } = useSettings()

    const handleThemeChange = () => {
        if (theme === 'light') setTheme('dark')
        else setTheme('light')
    }

    return (
        <CollapsibleHeaderPage
            headerText="Settings"
        >
            <View style={[styles.container, { justifyContent: 'space-between' }]}>
                <View style={[travelDetailStyles[theme].card, { gap: 10 }]}>
                    <View style={{
                        gap: 15,
                        flexDirection: 'row',
                    }}>
                        <PickerItem
                            label="List"
                            imagePath={localAssets.display_list}
                            selected={travelDisplayMode === 'list'}
                            onPress={() => setTravelDisplayMode('list')}
                        />
                        <PickerItem
                            label="Card"
                            imagePath={localAssets.display_card}
                            selected={travelDisplayMode === 'card'}
                            onPress={() => setTravelDisplayMode('card')}
                        />
                    </View>
                    <Divider />
                    <Switcher onPress={() => setEnableVibration(!enableVibration)} overrideIsEnabled={enableVibration}>Enable vibration</Switcher>
                    <Divider />
                    <Switcher onPress={handleThemeChange} overrideIsEnabled={theme === 'light' ? false : true}>Dark mode</Switcher>
                </View>
                <View style={{ width: '100%', alignItems: 'flex-end' }}>
                    <Input.LabelLight>Version {pack.default.expo.version}</Input.LabelLight>
                </View>
            </View>
        </CollapsibleHeaderPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        justifyContent: 'flex-start',
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