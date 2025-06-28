function calculateDistanceInMeters(point1: { lat: number; lon: number }, point2: { lat: number; lon: number }): number {
    const R = 6371e3 // Earth's radius in meters
    const lat1 = point1.lat * Math.PI / 180 // convert to radians
    const lat2 = point2.lat * Math.PI / 180 // convert to radians
    const deltaLat = (point2.lat - point1.lat) * Math.PI / 180
    const deltaLon = (point2.lon - point1.lon) * Math.PI / 180

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c // Distance in meters
    return distance
}

// Based on the examples you provided:
// 
// *   3522 meters (3.522 km) corresponds to zoom 12.
// *   208576 meters (208.576 km) corresponds to zoom 6.5.
// 
// Let's try to model this relationship. 
// A common approach is to think about the "meters per pixel" at different zoom levels, or conversely, 
// the "width of the world" that fits on the screen at a given zoom level.
// 
// A rough model for the width of the visible world at a given zoom level `z` on a Mercator projection is:
// 
// `World Width at Zoom z ≈ Circumference of Earth / (2^z)`
// 
// And if you have a map container of a certain pixel width, the meters per pixel would be:
// 
// `Meters per Pixel at Zoom z ≈ (Circumference of Earth / 2^z) / Map Width in Pixels`
// 
// Your `longestDimension` in meters represents the approximate real-world size of the area you need to display. 
// You want to find a zoom level where this `longestDimension` fits comfortably within the visible map area.
// 
// We can use your data points to create a simple lookup or interpolation function. 
// Since the relationship is exponential, a logarithmic scale might be more appropriate for mapping length to zoom.
// 
// Let's consider a simplified model based on your two points:
// 
// *   Log base 2 of 3522 ≈ 11.78
// *   Log base 2 of 208576 ≈ 17.67
// 
// This doesn't seem to directly map to the zoom levels (12 and 6.5) in a simple linear fashion. 
// The relationship is likely more complex, involving the map's pixel dimensions and the specific map provider's zoom level definitions.
// 
// A more practical approach is to create a function that interpolates between your 
// known data points and potentially extrapolates for values outside this range. 
// Since the relationship between meters and zoom is roughly logarithmic with respect to the meters and linear with respect to the zoom (in reverse), 
// we can try a logarithmic interpolation.
// 
// Let's use your provided data points as control points:
// 
// `(length_in_meters_1, zoom_1) = (3522, 12)`
// `(length_in_meters_2, zoom_2) = (208576, 6.5)`
// 
// We can try a linear interpolation on a logarithmic scale of the length:
// 
// `zoom = m * log(length_in_meters) + c`
// 
// Where `m` and `c` are constants we can find using your two points.
// 
// Using a base-10 logarithm:
// 
// `12 = m * log10(3522) + c`
// `6.5 = m * log10(208576) + c`
// 
// `12 = m * 3.5468 + c`
// `6.5 = m * 5.3193 + c`
// 
// Subtracting the second equation from the first:
// 
// `12 - 6.5 = (m * 3.5468 + c) - (m * 5.3193 + c)`
// `5.5 = m * (3.5468 - 5.3193)`
// `5.5 = m * (-1.7725)`
// `m = 5.5 / -1.7725 ≈ -3.103`
// 
// Now substitute `m` back into the first equation to find `c`:
// 
// `12 = -3.103 * 3.5468 + c`
// `12 = -11.004 + c`
// `c = 12 + 11.004 ≈ 23.004`
// 
// So, an approximate formula based on your data is:
// 
// `zoom ≈ -3.103 * log10(longestDimension) + 23.004`
// 
// Let's test this with your values:
// 
// *   For `longestDimension = 3522`: `-3.103 * log10(3522) + 23.004 ≈ -3.103 * 3.5468 + 23.004 ≈ -11.004 + 23.004 ≈ 12` (Matches your data)
// *   For `longestDimension = 208576`: `-3.103 * log10(208576) + 23.004 ≈ -3.103 * 5.3193 + 23.004 ≈ -16.506 + 23.004 ≈ 6.498` (Very close to 6.5)
// 
// This formula seems to work reasonably well for your specific data points.

function getZoomLevelForDimension(longestDimensionInMeters: number): number {
    // Based on the linear interpolation on a log scale derived from your examples
    // zoom ≈ -3.103 * log10(longestDimension) + 23.004

    // 3.522km good with zoom 12
    // 208.576km good with zoom 6.5

    if (longestDimensionInMeters <= 0) {
        return 18
    }

    const zoom = -3.103 * Math.log10(longestDimensionInMeters) + 23.3

    const minZoom = 0
    const maxZoom = 20
    return Math.max(minZoom, Math.min(maxZoom, zoom))
}

function getSimpleCentroid(points: number[][] | undefined | null) {
    if (!points || points === null || points.length === 0) {
        return null
    }

    let minLon = points[0][0]
    let maxLon = points[0][0]
    let minLat = points[0][1]
    let maxLat = points[0][1]

    for (const point of points) {
        minLon = Math.min(minLon, point[0])
        maxLon = Math.max(maxLon, point[0])
        minLat = Math.min(minLat, point[1])
        maxLat = Math.max(maxLat, point[1])
    }

    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2

    // Calculate width in meters: distance between two points at min/max longitude
    // and the average latitude
    const widthMeters = calculateDistanceInMeters(
        { lat: centerLat, lon: minLon },
        { lat: centerLat, lon: maxLon }
    )

    // Calculate height in meters: distance between two points at min/max latitude
    // and the average longitude (longitude doesn't affect vertical distance much)
    const heightMeters = calculateDistanceInMeters(
        { lat: minLat, lon: centerLon },
        { lat: maxLat, lon: centerLon }
    )

    const longestDimensionMeters = Math.max(widthMeters, heightMeters).toFixed()

    const zoom = getZoomLevelForDimension(Number(longestDimensionMeters))

    return {
        center: { lat: centerLat, lon: centerLon },
        longestDimension: longestDimensionMeters,
        zoom: zoom,
    }
}

export {
    getSimpleCentroid
}
