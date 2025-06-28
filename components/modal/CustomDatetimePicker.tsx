import { useDialog } from '@/context/DialogContext'
import { useTheme } from '@/context/ThemeContext'
import { useLoading } from '@/hooks/useLoading'
import React, { useEffect, useState } from 'react'
import {
    ScrollView,
    Text,
    View,
    ViewProps
} from 'react-native'
import Button from '../button/BaseButton'
import Divider from '../Divider'
import { TextInputBase } from '../input/TextInput'
import ModalTemplate from '../ModalTemplate'

interface CustomDateTimePickerProps {
    label?: string
    visible: boolean
    initialDateTime: Date
    onClose: () => void
    onConfirm: (dateTime: Date) => void
    incrementSeconds?: number
}

export default function CustomDateTimePicker({
    label,
    visible,
    initialDateTime,
    onClose,
    onConfirm,
}: CustomDateTimePickerProps) {
    const { dialog } = useDialog()
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { loading } = useLoading(25)

    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [day, setDay] = useState('')
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')
    const [seconds, setSeconds] = useState('')

    const updateStringPartsFromDate = (date: Date) => {
        setYear(date.getFullYear().toString())
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'))
        setDay(date.getDate().toString().padStart(2, '0'))
        setHours(date.getHours().toString().padStart(2, '0'))
        setMinutes(date.getMinutes().toString().padStart(2, '0'))
        setSeconds(date.getSeconds().toString().padStart(2, '0'))
    }

    useEffect(() => {
        if (visible) {
            const dateToUse = initialDateTime instanceof Date && !isNaN(initialDateTime.getTime())
                ? new Date(initialDateTime)
                : new Date()
            updateStringPartsFromDate(dateToUse)
        }
    }, [visible, initialDateTime])

    const handlePartChange = (part: 'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds', value: string) => {
        const numericRegex = /^[0-9]*$/
        if (!numericRegex.test(value)) return

        switch (part) {
            case 'year': setYear(value.slice(0, 4)); break
            case 'month': setMonth(value.slice(0, 2)); break
            case 'day': setDay(value.slice(0, 2)); break
            case 'hours': setHours(value.slice(0, 2)); break
            case 'minutes': setMinutes(value.slice(0, 2)); break
            case 'seconds': setSeconds(value.slice(0, 2)); break
        }
    }

    const constructDateFromParts = (): Date | null => {
        const y = parseInt(year, 10)
        const m = parseInt(month, 10)
        const d = parseInt(day, 10)
        const h = parseInt(hours, 10)
        const min = parseInt(minutes, 10)
        const s = parseInt(seconds, 10)

        let errorMessage = ""

        if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(min) || isNaN(s)) {
            errorMessage = "One or more date/time fields are not valid numbers."
        } else if (y < 1000 || y > 9999) {
            errorMessage = "Year must be between 1000 and 9999."
        } else if (m < 1 || m > 12) {
            errorMessage = "Month must be between 1 and 12."
        } else if (d < 1 || d > 31) {
            errorMessage = "Day must be between 1 and 31."
        } else if (h < 0 || h > 23) {
            errorMessage = "Hours must be between 0 and 23."
        } else if (min < 0 || min > 59) {
            errorMessage = "Minutes must be between 0 and 59."
        } else if (s < 0 || s > 59) {
            errorMessage = "Seconds must be between 0 and 59."
        }

        if (errorMessage) {
            dialog("Invalid Input", errorMessage)
            return null
        }

        const date = new Date(y, m - 1, d, h, min, s)

        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
            dialog("Invalid Date", "The day is not valid for the selected month and year.")
            return null
        }
        return date
    }

    const handleConfirm = () => {
        const newDate = constructDateFromParts()
        if (newDate) {
            onConfirm(newDate)
        }
    }

    const handleTimeNow = () => {
        const now = new Date()

        handlePartChange('year', now.getFullYear().toString())
        handlePartChange('month', (now.getMonth() + 1).toString().padStart(2, '0'))
        handlePartChange('day', now.getDate().toString().padStart(2, '0'))
        handlePartChange('hours', now.getHours().toString().padStart(2, '0'))
        handlePartChange('minutes', now.getMinutes().toString().padStart(2, '0'))
        handlePartChange('seconds', now.getSeconds().toString().padStart(2, '0'))
    }

    return (
        <ModalTemplate.Bottom
            visible={visible}
            onRequestClose={onClose}
        >
            {loading ? (
                <></>
            ) : (
                <ModalTemplate.BottomContainer>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 10 }}>
                        <Text style={[
                            {
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                paddingBottom: 5,

                                color: theme.palette.textBlack
                            }
                        ]}>{label ? label : 'Set Date and Time'}</Text>

                        <TimeSection>
                            <NumberInput label='Year' value={year} placeholder='YYYY' onChangeText={(text) => handlePartChange('year', text)} maxLength={4} />
                            <NumberInput label='Month' value={month} placeholder='MM' onChangeText={(text) => handlePartChange('month', text)} />
                            <NumberInput label='Day' value={day} placeholder='DD' onChangeText={(text) => handlePartChange('day', text)} />
                        </TimeSection>

                        <TimeSection>
                            <NumberInput label='Hours' value={hours} placeholder='HH' onChangeText={(text) => handlePartChange('hours', text)} />
                            <NumberInput label='Minutes' value={minutes} placeholder='MM' onChangeText={(text) => handlePartChange('minutes', text)} />
                            <NumberInput label='Seconds' value={seconds} placeholder='ss' onChangeText={(text) => handlePartChange('seconds', text)} />
                        </TimeSection>

                        <Button.Dismiss onPress={handleTimeNow}>Now</Button.Dismiss>

                        <Divider />

                        <View style={{
                            gap: 10,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                            <Button.Cancel onPress={onClose}>Cancel</Button.Cancel>
                            <Button.Add onPress={handleConfirm}>Confirm</Button.Add>
                        </View>
                    </ScrollView>
                </ModalTemplate.BottomContainer>
            )}
        </ModalTemplate.Bottom>
    )
}

function TimeSection(props: ViewProps) {
    const { style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }, style
            ]}
            {...restProps}
        >{props.children}</View>
    )
}

interface NumberInputProps {
    label: string
    value: string
    maxLength?: number
    placeholder: string
    onChangeText: (text: string) => void
}

function NumberInput({ label, value, placeholder, onChangeText, maxLength = 2 }: NumberInputProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
        }}>
            <Text style={{
                flex: 1,
                fontSize: 16,
                minWidth: 70,
                textAlign: 'center',
                paddingBottom: 5,

                color: theme.palette.textBlack,
            }}>{label}</Text>
            <TextInputBase.Numeric
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                onChangeText={onChangeText}
            />
        </View>
    )
}