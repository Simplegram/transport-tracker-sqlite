import { useDialog } from "@/context/DialogContext"
import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import { db } from "@/src/services/dataDbService"
import { LapTemplate } from "@/src/types/data/LapTemplates"
import { RideTemplate } from "@/src/types/data/RideTemplates"
import { TripTemplate } from "@/src/types/data/TripTemplates"
import { Direction, IconType, Lap, Ride, Route, Stop, StopVehicleType, Trip, VehicleType } from "@/src/types/Types"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"

interface Data {
    directions?: Direction[]
    icons?: IconType[]
    vehicle_types?: VehicleType[]
    stops?: Stop[]
    stop_vehicle_types: StopVehicleType[]
    routes?: Route[]
    rides?: Ride[]
    laps?: Lap[]
    trips: Trip[]
    tripTemplates: TripTemplate[]
    rideTemplates: RideTemplate[]
    lapTemplates: LapTemplate[]
}

interface Settings {
    vibration: boolean
    travelDisplayMode: 'card' | 'list'
    theme: 'light' | 'dark'
    directLapSave: boolean
    directRideLapSave: boolean
}

export default function useExportImport() {
    const { dialog } = useDialog()
    const { setTheme } = useTheme()
    const { setEnableVibration, setTravelDisplayMode, setDirectLapSave, setDirectRideLapSave } = useSettings()

    const dataProcessors = {
        directions: {
            sql: 'INSERT OR IGNORE INTO directions (id, name) VALUES (?, ?)',
            mapFn: (item: Direction) => [item.id, item.name],
        },
        icons: {
            sql: 'INSERT OR IGNORE INTO icons (id, name) VALUES (?, ?)',
            mapFn: (item: IconType) => [item.id, item.name],
        },
        vehicle_types: {
            sql: 'INSERT OR IGNORE INTO types (id, name, icon_id) VALUES (?, ?, ?)',
            mapFn: (item: VehicleType) => [item.id, item.name, item.icon_id],
        },
        stops: {
            sql: 'INSERT OR IGNORE INTO stops (id, name, name_alt, lat, lon) VALUES (?, ?, ?, ?, ?)',
            mapFn: (item: Stop) => [item.id, item.name, item.name_alt, item.lat, item.lon],
        },
        stop_vehicle_types: {
            sql: 'INSERT OR IGNORE INTO stop_vehicle_types (stop_id, vehicle_type_id) VALUES (?, ?)',
            mapFn: (item: StopVehicleType) => [item.stop_id, item.vehicle_type_id],
        },
        routes: {
            sql: 'INSERT OR IGNORE INTO routes (id, code, name, first_stop_id, last_stop_id, vehicle_type_id) VALUES (?, ?, ?, ?, ?, ?)',
            mapFn: (item: Route) => [item.id, item.code, item.name, item.first_stop_id, item.last_stop_id, item.vehicle_type_id],
        },
        rides: {
            sql: `INSERT OR IGNORE INTO rides (
                id, 
                created_at, 
                trip_id,
                bus_initial_arrival, 
                bus_initial_departure, 
                bus_final_arrival, 
                route_id, 
                first_stop_id, 
                last_stop_id, 
                notes,
                vehicle_code, 
                direction_id, 
                vehicle_type_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            mapFn: (item: Ride) => [
                item.id,
                item.created_at,
                item.trip_id,
                item.bus_initial_arrival,
                item.bus_initial_departure,
                item.bus_final_arrival,
                item.route_id,
                item.first_stop_id,
                item.last_stop_id,
                item.notes,
                item.vehicle_code,
                item.direction_id,
                item.vehicle_type_id
            ],
        },
        laps: {
            sql: 'INSERT OR IGNORE INTO laps (id, ride_id, time, note, stop_id, lat, lon) VALUES (?, ?, ?, ?, ?, ?, ?)',
            mapFn: (item: Lap) => [item.id, item.ride_id, item.time, item.note, item.stop_id, item.lat, item.lon],
        },
        trips: {
            sql: 'INSERT OR IGNORE INTO trips (id, name, created_at, description, template_id, started_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            mapFn: (item: Trip) => [item.id, item.name, item.created_at, item.description, item.template_id, item.started_at, item.completed_at]
        },
        tripTemplates: {
            sql: 'INSERT OR IGNORE INTO trip_templates (id, created_at, name, description) VALUES (?, ?, ?, ?)',
            mapFn: (item: TripTemplate) => [item.id, item.created_at, item.name, item.description]
        },
        rideTemplates: {
            sql: 'INSERT OR IGNORE INTO ride_templates (id, trip_template_id, sequence_order, route_id, vehicle_type_id, first_stop_id, last_stop_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            mapFn: (item: RideTemplate) => [item.id, item.trip_template_id, item.sequence_order, item.route_id, item.vehicle_type_id, item.first_stop_id, item.last_stop_id, item.notes]
        },
        lapTemplates: {
            sql: 'INSERT OR IGNORE INTO lap_templates (id, ride_template_id, sequence_order, stop_id, note) VALUES (?, ?, ?, ?, ?)',
            mapFn: (item: LapTemplate) => [item.id, item.ride_template_id, item.sequence_order, item.stop_id, item.note]
        }
    }

    const importOrder: (keyof typeof dataProcessors)[] = [
        'directions',
        'icons',
        'vehicle_types',
        'stops',
        'stop_vehicle_types',
        'routes',
        'tripTemplates',
        'rideTemplates',
        'lapTemplates',
        'trips',
        'rides',
        'laps'
    ]

    const importData = async (data: Data) => {
        const commands: SQLBatchTuple[] = []
        const messages: string[] = []

        for (const key of importOrder) {
            const processor = dataProcessors[key]
            const items = data[key]

            if (processor && Array.isArray(items) && items.length > 0) {
                // Map each item in the data array to its parameters and push to commands
                items.forEach((item: any) => { // Cast to any to match processor's mapFn type
                    commands.push([processor.sql, processor.mapFn(item)] as unknown as SQLBatchTuple)
                })
                console.log(`Prepared ${items.length} commands for ${key}.`)
                messages.push(`Prepared ${items.length} ${key}.`)
            } else if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Log if a key exists but has no data or no processor defined
                if (!processor) {
                    console.warn(`No processor defined for key: ${key}. Skipping.`)
                } else if (!Array.isArray(items) || items.length === 0) {
                    console.warn(`Key "${key}" present but data is empty or not an array. Skipping.`)
                }
            }
        }

        if (commands.length === 0) {
            console.log("No data to import. Skipping batch execution.")
            return true // Nothing to do, consider it a success
        }

        try {
            // Assuming db.executeBatch or db.sqlBatch exists and works this way
            db.executeSync('PRAGMA foreign_keys = OFF;')
            await db.executeBatch(commands) // Or db.sqlBatch(commands) for react-native-sqlite-storage
            console.log("All data imported successfully in a single batch transaction.")
            db.executeSync('PRAGMA foreign_keys = ON;')

            dialog("Data successfully imported", messages.join('\r\n'))

            return true
        } catch (error) {
            console.error("Batch import failed:", error)
            // You might want more granular error logging based on the error object structure
            return false
        }
    }

    const importSettings = (settings: Settings) => {
        setTheme(settings.theme)
        setEnableVibration(settings.vibration)
        setTravelDisplayMode(settings.travelDisplayMode)
        setDirectLapSave(settings.directLapSave)
        setDirectRideLapSave(settings.directRideLapSave)
    }

    return {
        importData, importSettings
    }
}