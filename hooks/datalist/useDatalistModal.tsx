import AddDirectionModal from "@/components/modal/addModal/AddDirectionModal"
import AddIconModal from "@/components/modal/addModal/AddIconModal"
import AddRouteModal from "@/components/modal/addModal/AddRouteModal"
import AddStopModal from "@/components/modal/addModal/AddStopModal"
import AddVehicleTypeModal from "@/components/modal/addModal/AddVehicleTypeModal"
import EditDirectionModal from "@/components/modal/editModal/EditDirectionModal"
import EditIconModal from "@/components/modal/editModal/EditIconModal"
import EditRouteModal from "@/components/modal/editModal/EditRouteModal"
import EditStopModal from "@/components/modal/editModal/EditStopModal"
import EditVehicleTypeModal from "@/components/modal/editModal/EditVehicleTypeModal"
import { useDialog } from "@/context/DialogContext"
import { AddableIconType, AddableRoute, AddableStop, AddableVehicleType } from "@/src/types/AddableTravels"
import { EditableRoute, EditableStop, EditableVehicleType } from "@/src/types/EditableTravels"
import { Direction, IconType } from "@/src/types/Travels"
import { useCallback, useState } from "react"
import useDataOperations from "../data/useDataOperations"
import useDirections from "../data/useDirections"
import useIcons from "../data/useIcons"
import useRoutes from "../data/useRoutes"
import useVehicleTypes from "../data/useVehicleTypes"
// import useModifyTravelData from "./useModifyTravelData"

interface ModalConfig {
    title: string
    content: any
    onSubmitDataHandler: (data: any) => void
}

interface ModalConfigMap {
    [key: string]: ModalConfig
}

export default function useDatalistModal(refetch: () => void) {
    const { dialog } = useDialog()

    const { insertDirection, editDirection } = useDirections()
    const { addStops, editStops } = useDataOperations()
    const { insertRoute, editRoute } = useRoutes()
    const { insertVehicleType, editVehicleType } = useVehicleTypes()
    const { insertIcon, editIcon } = useIcons()

    const [activeModalConfig, setActiveModalConfig] = useState<ModalConfig | undefined>(undefined)

    const handleAddDirection = (data: Direction) => {
        insertDirection(data)
        refetch()
        dialog('Direction Added', `Direction "${data.name}" has been saved.`)
    }

    const handleAddStop = (data: AddableStop) => {
        addStops(data)
        refetch()
        dialog('Stop Added', `Stop "${data.name}" has been saved.`)
    }

    const handleAddRoute = (data: AddableRoute) => {
        insertRoute(data)
        refetch()
        dialog('Route Added', `Route "${data.name}" has been saved.`)
    }

    const handleAddVehicleType = (data: AddableVehicleType) => {
        insertVehicleType(data)
        refetch()
        dialog('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`)
    }

    const handleAddIcon = (data: AddableIconType) => {
        insertIcon(data)
        refetch()
        dialog('Icon Added', `Icon "${data.name}" has been saved.`)
    }

    // ---

    const handleEditDirection = (data: Direction) => {
        editDirection(data)
        refetch()
        dialog('Direction Changed', `Stop "${data.name}" has been saved.`)
    }

    const handleEditStop = (data: EditableStop) => {
        editStops(data)
        refetch()
        dialog('Stop Changed', `Stop "${data.name}" has been saved.`)
    }

    const handleEditVehicleType = (data: EditableVehicleType) => {
        editVehicleType(data)
        refetch()
        dialog('Vehicle Type Changed', `Vehicle Type "${data.name}" has been saved.`)
    }

    const handleEditRoute = (data: EditableRoute) => {
        editRoute(data)
        refetch()
        dialog('Route Changed', `Route "${data.name}" has been saved.`)
    }

    const handleEditIcon = (data: IconType) => {
        editIcon(data)
        refetch()
        dialog('Route Changed', `Route "${data.name}" has been saved.`)
    }

    const addModalConfigs: ModalConfigMap = {
        "Directions": {
            title: 'Add Direction',
            content: AddDirectionModal,
            onSubmitDataHandler: handleAddDirection
        },
        "Stops": {
            title: 'Add Stop',
            content: AddStopModal,
            onSubmitDataHandler: handleAddStop
        },
        "Routes": {
            title: 'Add Route',
            content: AddRouteModal,
            onSubmitDataHandler: handleAddRoute
        },
        "VehicleTypes": {
            title: 'Add Vehicle Type',
            content: AddVehicleTypeModal,
            onSubmitDataHandler: handleAddVehicleType
        },
        "Icons": {
            title: 'Add Icons',
            content: AddIconModal,
            onSubmitDataHandler: handleAddIcon,
        },
    }

    const editModalConfigs: ModalConfigMap = {
        "Directions": {
            title: 'Edit Direction',
            content: EditDirectionModal,
            onSubmitDataHandler: handleEditDirection
        },
        "Stops": {
            title: 'Edit Stop',
            content: EditStopModal,
            onSubmitDataHandler: handleEditStop
        },
        "Routes": {
            title: 'Edit Route',
            content: EditRouteModal,
            onSubmitDataHandler: handleEditRoute
        },
        "VehicleTypes": {
            title: 'Edit Vehicle Type',
            content: EditVehicleTypeModal,
            onSubmitDataHandler: handleEditVehicleType
        },
        "Icons": {
            title: 'Edit Icon',
            content: EditIconModal,
            onSubmitDataHandler: handleEditIcon
        },
    }

    const setActiveModal = useCallback((dataType: string) => {
        setActiveModalConfig(addModalConfigs[dataType])
    }, [])

    const setActiveEditModal = useCallback((dataType: string) => {
        setActiveModalConfig(editModalConfigs[dataType])
    }, [])

    return {
        activeModalConfig, setActiveModalConfig,
        setActiveModal, setActiveEditModal
    }
}