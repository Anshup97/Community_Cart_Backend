export const get_elevation = async (lat: number, lng: number) => {
    try {
        const location = new google.maps.LatLng(lat, lng);
        const elevator = new google.maps.ElevationService();
        const res = await elevator.getElevationForLocations({ locations: [location] })
        if (res.results && res.results.length > 0) {
            return res.results[0].elevation;
        } else {
            throw new Error('No results found')
        }
    } catch (error) {
        throw new Error('Error in getting elevation =>' + error)
    }
}