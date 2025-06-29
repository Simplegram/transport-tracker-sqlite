import { Direction, IconType, Lap, Route, Stop, Travel, VehicleType } from "@/src/types/Travels"
import { SQLBatchTuple } from "@op-engineering/op-sqlite"
import useDatabase from "./useDatabase"

interface Data {
    directions?: Direction[]
    icons?: IconType[]
    vehicle_types?: VehicleType[]
    stops?: Stop[]
    routes?: Route[]
    travels?: Travel[]
    laps?: Lap[]
}

export default function useExportImport() {
    const { db } = useDatabase()

    const dataProcessors = {
        directions: {
            sql: 'INSERT INTO directions (id, name) VALUES (?, ?)',
            mapFn: (item: Direction) => [item.id, item.name],
        },
        icons: {
            sql: 'INSERT INTO icons (id, name) VALUES (?, ?)',
            mapFn: (item: IconType) => [item.id, item.name],
        },
        vehicle_types: {
            sql: 'INSERT INTO types (id, name, icon_id) VALUES (?, ?, ?)',
            mapFn: (item: VehicleType) => [item.id, item.name, item.icon_id],
        },
        stops: {
            sql: 'INSERT INTO stops (id, name, name_alt, lat, lon, vehicle_type_id) VALUES (?, ?, ?, ?, ?, ?)',
            mapFn: (item: Stop) => [item.id, item.name, item.name_alt, item.lat, item.lon, item.vehicle_type_id],
        },
        routes: {
            sql: 'INSERT INTO routes (id, code, name, first_stop_id, last_stop_id, vehicle_type_id) VALUES (?, ?, ?, ?, ?, ?)',
            mapFn: (item: Route) => [item.id, item.code, item.name, item.first_stop_id, item.last_stop_id, item.vehicle_type_id],
        },
    }

    const importOrder: (keyof typeof dataProcessors)[] = [
        'directions',
        'icons',
        'vehicle_types',
        'stops',
        'routes',
    ]

    const importData = async (data: Data) => {
        const commands: SQLBatchTuple[] = []

        for (const key of importOrder) {
            const processor = dataProcessors[key]
            const items = data[key]

            if (processor && Array.isArray(items) && items.length > 0) {
                // Map each item in the data array to its parameters and push to commands
                items.forEach((item: any) => { // Cast to any to match processor's mapFn type
                    commands.push([processor.sql, processor.mapFn(item)])
                })
                console.log(`Prepared ${items.length} commands for ${key}.`)
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