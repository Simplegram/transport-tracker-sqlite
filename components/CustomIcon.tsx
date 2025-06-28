import { useTheme } from '@/context/ThemeContext'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { IconProps } from 'react-native-vector-icons/Icon'

export default function CustomIcon({ style, name, size = 20, ...props }: IconProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Icon
            style={[
                {
                    alignItems: 'center',
                    color: theme.palette.textBlack,
                }, style
            ]}
            name={name}
            size={size}
            {...props}
        />
    )
}

interface SwitchProps extends IconProps {
    condition: boolean
}

function Switch({ condition, ...props }: SwitchProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <CustomIcon style={condition && { color: theme.palette.textPrimary }} {...props} />
    )
}

CustomIcon.Switch = Switch