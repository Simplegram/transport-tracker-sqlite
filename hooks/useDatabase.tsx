import { db } from '@/src/services/dataDbService'
import { useState } from "react"

export default function useDatabase() {
    const [isMigrating, setIsMigrating] = useState<boolean>(true)
    const [migrationError, setMigrationError] = useState<string | null>(null) // State to store any migration errors

    async function migrateDb() {
        const DATABASE_VERSION = 1
        let currentDbVersion: number = 0

        try {
            const versionResult = await db.execute('PRAGMA user_version')
            currentDbVersion = (versionResult.rows?.[0].user_version as number) ?? 0
            console.log(`Current DB version: ${currentDbVersion}`)

            if (currentDbVersion < DATABASE_VERSION) {
                console.log(`Migration needed from version ${currentDbVersion} to ${DATABASE_VERSION}`)

                if (currentDbVersion === 0) {
                    console.log("Starting migration from version 0 (initial setup)...")
                    await db.execute(`
                        PRAGMA journal_mode = 'wal';

                        CREATE TABLE directions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL
                        );

                        CREATE TABLE icons (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL
                        );

                        CREATE TABLE types (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            icon_id INTEGER,
                            FOREIGN KEY (icon_id) REFERENCES icons (id) ON UPDATE CASCADE ON DELETE SET NULL
                        );

                        CREATE TABLE stops (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL DEFAULT '',
                            lat REAL,
                            lon REAL,
                            name_alt TEXT
                        );

                        CREATE TABLE stop_vehicle_types (
                            stop_id INTEGER NOT NULL,
                            vehicle_type_id INTEGER NOT NULL,
                            PRIMARY KEY (stop_id, vehicle_type_id),
                            FOREIGN KEY (stop_id) REFERENCES stops (id) ON DELETE CASCADE,
                            FOREIGN KEY (vehicle_type_id) REFERENCES types (id) ON DELETE CASCADE
                        );

                        CREATE INDEX IF NOT EXISTS idx_stop_vehicle_types_stop_id ON stop_vehicle_types (stop_id);
                        CREATE INDEX IF NOT EXISTS idx_stop_vehicle_types_vehicle_type_id ON stop_vehicle_types (vehicle_type_id);

                        CREATE TABLE routes (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            first_stop_id INTEGER NOT NULL,
                            last_stop_id INTEGER NOT NULL,
                            code TEXT,
                            name TEXT,
                            vehicle_type_id INTEGER,
                            FOREIGN KEY (first_stop_id) REFERENCES stops (id),
                            FOREIGN KEY (last_stop_id) REFERENCES stops (id),
                            FOREIGN KEY (vehicle_type_id) REFERENCES types (id)
                        );

                        CREATE INDEX IF NOT EXISTS routes_first_stop_id_idx ON routes (first_stop_id);
                        CREATE INDEX IF NOT EXISTS routes_last_stop_id_idx ON routes (last_stop_id);
                        CREATE INDEX IF NOT EXISTS routes_vehicle_type_id_idx ON routes (vehicle_type_id);

                        CREATE TABLE rides (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            created_at DATETIME NOT NULL,
                            bus_initial_arrival DATETIME,
                            bus_initial_departure DATETIME,
                            bus_final_arrival DATETIME,
                            route_id INTEGER NOT NULL,
                            first_stop_id INTEGER NOT NULL,
                            last_stop_id INTEGER NOT NULL,
                            notes TEXT,
                            vehicle_code TEXT,
                            direction_id INTEGER NOT NULL,
                            vehicle_type_id INTEGER NOT NULL,
                            FOREIGN KEY (route_id) REFERENCES routes (id),
                            FOREIGN KEY (first_stop_id) REFERENCES stops (id),
                            FOREIGN KEY (last_stop_id) REFERENCES stops (id),
                            FOREIGN KEY (direction_id) REFERENCES directions (id),
                            FOREIGN KEY (vehicle_type_id) REFERENCES types (id)
                        );

                        CREATE INDEX IF NOT EXISTS rides_id_idx ON rides (id);
                        CREATE INDEX IF NOT EXISTS rides_vehicle_type_id_idx ON rides (vehicle_type_id);
                        CREATE INDEX IF NOT EXISTS rides_last_stop_id_idx ON rides (last_stop_id);
                        CREATE INDEX IF NOT EXISTS rides_first_stop_id_idx ON rides (first_stop_id);
                        CREATE INDEX IF NOT EXISTS rides_direction_id_idx ON rides (direction_id);
                        CREATE INDEX IF NOT EXISTS rides_route_id_idx ON rides (route_id);

                        CREATE TABLE laps (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            ride_id INTEGER NOT NULL,
                            time DATETIME NOT NULL,
                            note TEXT,
                            stop_id INTEGER,
                            lat REAL,
                            lon REAL,
                            FOREIGN KEY (ride_id) REFERENCES rides (id) ON DELETE CASCADE,
                            FOREIGN KEY (stop_id) REFERENCES stops (id) ON DELETE SET NULL
                        );

                        CREATE INDEX IF NOT EXISTS laps_ride_id_idx ON laps (ride_id);
                    `)
                    console.log("Executed initial DDL statements.")
                    // After successful execution, update the DB version
                    await db.execute(`PRAGMA user_version = ${DATABASE_VERSION}`)
                    console.log(`Updated PRAGMA user_version to ${DATABASE_VERSION}`)
                }
                // If you had DATABASE_VERSION > 1, you'd add more else if blocks here for subsequent migrations
                // e.g., else if (currentDbVersion === 1) { /* migration from 1 to 2 */ }
            } else {
                console.log(`DB is already at or above target version ${DATABASE_VERSION}. No migration needed.`)
            }
            console.log("migration done") // This will now log for both cases (migrated or not)
        } catch (error: any) { // Catch any errors during the process
            console.error("Database migration failed:", error)
            setMigrationError(error.message || "An unknown error occurred during migration.")
            // You might want to re-throw the error or handle it more gracefully depending on your app's needs
        } finally {
            // Always set isMigrating to false, whether successful or failed
            setIsMigrating(false)
        }
    }

    return {
        db,
        isMigrating,
        migrationError, // Expose migration error state
        // You might not want to expose setIsMigrating or migrateDb publicly if they are handled internally
        // but for debugging, leaving them is fine.
        setIsMigrating,
        migrateDb
    }
}