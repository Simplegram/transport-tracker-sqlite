import { useDialog } from "@/context/DialogContext"
import { db } from "@/src/services/dataDbService"
import { Direction, IconType, Lap, Ride, Route, Stop, StopVehicleType, VehicleType } from "@/src/types/Types"
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
}

export default function useExportImport() {
    const { dialog } = useDialog()

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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            mapFn: (item: Ride) => [
                item.id,
                item.created_at,
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
    }

    const importOrder: (keyof typeof dataProcessors)[] = [
        'directions',
        'icons',
        'vehicle_types',
        'stops',
        'stop_vehicle_types',
        'routes',
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
            await db.executeBatch(commands) // Or db.sqlBatch(commands) for react-native-sqlite-storage
            console.log("All data imported successfully in a single batch transaction.")

            dialog("Data successfully imported", messages.join('\r\n'))

            return true
        } catch (error) {
            console.error("Batch import failed:", error)
            // You might want more granular error logging based on the error object structure
            return false
        }
    }

    return {
        importData
    }
}