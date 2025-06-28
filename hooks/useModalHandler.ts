import { useState } from "react"

export default function useModalHandler() {
    const [showModal, setShowModal] = useState(false)
    const [editingField, setEditingField] = useState<string | undefined>(undefined)
    const [searchQuery, setSearchQuery] = useState('')

    const openModalWithSearch = (field?: string) => {
        if (field) setEditingField(field)
        setSearchQuery('')
        setShowModal(true)
    }

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingField(undefined)
        setSearchQuery('')
    }

    return {
        showModal, setShowModal,
        editingField, setEditingField,
        searchQuery, setSearchQuery,
        openModal, openModalWithSearch, closeModal
    }
}