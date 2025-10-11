mapboxgl.accessToken = mapToken;


const defaultCoordinates = [78.9629, 20.5937];


const coordinates = listing.geometry && listing.geometry.coordinates 
    ? listing.geometry.coordinates 
    : defaultCoordinates;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 12 
});


map.addControl(new mapboxgl.NavigationControl());


const marker = new mapboxgl.Marker({
    color: "#FF385C",
    scale: 1.2
})
.setLngLat(coordinates)
.addTo(map);


const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h6>${listing.title}</h6><p>${listing.location}</p>`);

marker.setPopup(popup);


map.on('load', () => {
    map.resize();
    map.flyTo({
        center: coordinates,
        zoom: 10,
        essential: true
    });
});
