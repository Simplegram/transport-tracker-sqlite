import { useTripContext } from "@/context/TripContext"
import { AddableRide, AddableTrip } from "@/src/types/AddableTypes"
import moment from "moment-timezone"
import useRideTemplates from "../data/templates/useRideTemplates"
import useTripTemplates from "../data/templates/useTripTemplates"
import useRides from "../data/useRides"
import useTrips from "../data/useTrips"

export default function useCreateTrip() {
    const { setTripId } = useTripContext()

    const { getRideTemplatesByTripTemplateId } = useRideTemplates()
    const { getTripTemplateById } = useTripTemplates()
    const { insertTrip } = useTrips()
    const { insertRide } = useRides()

    const createTripFromTemplate = (templateId: number) => {
        const tripTemplate = getTripTemplateById(templateId)
        if (tripTemplate) {
            const tripData: AddableTrip = {
                name: tripTemplate.name,
                created_at: moment().toISOString(),
                description: tripTemplate.description,
                template_id: templateId,
                started_at: moment().toISOString(),
                completed_at: null
            }

            const newTrip = insertTrip(tripData)
            if (newTrip) {
                const newTripId = newTrip.insertId
                if (newTripId) setTripId(newTripId)

                const rideTemplates = getRideTemplatesByTripTemplateId(templateId)
                if (rideTemplates && newTripId) {
                    rideTemplates.map(rideTemplate => {
                        const rideData: AddableRide = {
                            created_at: moment().toISOString(),
                            trip_id: newTripId,
                            route_id: rideTemplate.route_id,
                            first_stop_id: rideTemplate.first_stop_id,
                            last_stop_id: rideTemplate.last_stop_id,
                            vehicle_type_id: rideTemplate.vehicle_type_id,
                            bus_initial_arrival: null,
                            bus_initial_departure: null,
                            bus_final_arrival: null,
                            notes: null,
                            vehicle_code: null,
                            direction_id: null
                        }
                        insertRide(rideData)
                    })
                }
            }
        }
    }

    return {
        createTripFromTemplate
    }
}