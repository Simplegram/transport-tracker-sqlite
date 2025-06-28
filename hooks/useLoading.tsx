import { useEffect, useState } from "react"

export function useLoading(timeout: number = 500) {
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, timeout)
    }, [])

    return {
        loading
    }
}

export function useToggleLoading(timeout: number = 500, defaultValue: boolean = false) {
    const [loading, setLoading] = useState<boolean>(defaultValue)

    const toggleLoading = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, timeout)
    }

    return {
        loading, setLoading, toggleLoading
    }
}