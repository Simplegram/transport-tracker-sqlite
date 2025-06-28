import { useTheme } from '@/context/ThemeContext'
import {
    KeyboardAvoidingView,
    Modal,
    ModalProps,
    TouchableOpacity,
    TouchableOpacityProps,
    useWindowDimensions,
    View,
    ViewProps
} from 'react-native'


export default function ModalTemplate({ visible, onRequestClose, style, ...props }: ModalProps) {
    const { transparent, statusBarTranslucent, ...restProps } = props

    const { height, width } = useWindowDimensions()

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onRequestClose}
            statusBarTranslucent={true}
            style={[{ width: width, height: height }, style]}

            {...restProps}
        >
            {restProps.children}
        </Modal>
    )
}

function ModalPresssable(props: TouchableOpacityProps) {
    const { children, style, onPress, ...restProps } = props

    return (
        <TouchableOpacity
            disabled={onPress ? false : true}
            activeOpacity={1}
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                }, style
            ]}
            onPress={onPress}
            {...restProps}
        >
            {children}
        </TouchableOpacity>
    )
}

function ModalBackdrop(props: TouchableOpacityProps) {
    const { children, style, onPress, ...restProps } = props

    return (
        <View
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

function ModalContainer(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    padding: 20,
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: 'space-between',

                    borderColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

function CalendarContainer(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, ...restProps } = props

    return (
        <View
            style={[
                {
                    flex: 1,
                    height: 500,
                    position: 'relative',

                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

function ModalBottomContainer(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    padding: 20,
                    borderWidth: 1,
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,

                    borderTopColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

function ModalBottom({ visible, onRequestClose, ...props }: ModalProps) {
    const { animationType, ...restProps } = props

    return (
        <ModalTemplate
            animationType="slide"

            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalBackdrop>
                <ModalPresssable onPress={onRequestClose} />
                <KeyboardAvoidingView behavior='height'>
                    {restProps.children}
                </KeyboardAvoidingView>
            </ModalBackdrop>
        </ModalTemplate>
    )
}

ModalTemplate.Backdrop = ModalBackdrop

ModalTemplate.Container = ModalContainer
ModalTemplate.BottomContainer = ModalBottomContainer
ModalTemplate.CalendarContainer = CalendarContainer

ModalTemplate.Bottom = ModalBottom