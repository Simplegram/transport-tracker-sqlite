import { ModalProvider } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import Icon from "@react-native-vector-icons/fontawesome6"
import { Tabs, usePathname } from "expo-router"
import { StatusBar } from "react-native"

const TabsLayout = () => {
    const { theme } = useTheme()

    const barColor = theme === 'light' ? colors.white_100 : colors.black
    const iconColor = theme === 'light' ? colors.black : colors.white_200

    const getDisplayValue = () => {
        const paths = [
            "/manage/settings", "/manage/datalist", "/manage/import", "/manage/templatesList", "/manage/templateEditor",
            "/main/editRide", "/main/travelDetail", "/main/estimate"
        ]

        const currentPathname = usePathname()
        if (paths.indexOf(currentPathname) <= -1) return "flex"

        return "none"
    }

    return (
        <ModalProvider>
            <StatusBar backgroundColor={theme === 'light' ? colors.white_100 : colors.black} />
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        height: 60,
                        elevation: 0,
                        borderTopWidth: 0,

                        display: getDisplayValue(),
                        backgroundColor: barColor,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: 'bold',
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: iconColor,
                    headerShown: false,
                    sceneStyle: {
                        backgroundColor: barColor
                    }
                }}
                backBehavior="order"
            >
                <Tabs.Screen
                    name="main"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color }) => <Icon iconStyle="solid" size={24} name="house" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="createTrip"
                    options={{
                        title: "Add",
                        tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={color} />,
                        href: null
                    }}
                />
                <Tabs.Screen
                    name="addRide"
                    options={{
                        title: "Add",
                        tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={color} />,
                        // href: null
                    }}
                />
                <Tabs.Screen
                    name="manage"
                    options={{
                        title: "Modify",
                        tabBarIcon: ({ color }) => <Icon size={24} name="pen-to-square" color={color} />,
                    }}
                />
            </Tabs>
        </ModalProvider>
    )
}

export default TabsLayout