import useDatabase from "@/hooks/useDatabase"

const { db } = useDatabase()

export const DataReadService = {
    getDirections: async () => {
        let result = await db.execute('SELECT * FROM directions')

        return rows
    }
}