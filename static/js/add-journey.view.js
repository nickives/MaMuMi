/*
** View logic for the add-journey view
*/
function initMap() {
    map = new google.maps.Map(document.getElementById("gmap"), {
        center: { lat: 53.0, lng: 9.0 },
        zoom: 4,
    });

    map.setOptions({ disableDoubleClickZoom: true });

    const pointMarker = new google.maps.Marker({ map: map });
    const latInput = document.getElementById("lat");
    const lngInput = document.getElementById("lng");

    map.addListener("dblclick", (e) => {
        placeMarkerAndPanTo(e.latLng, map, pointMarker);
        setLatLng(e.latLng, latInput, lngInput);
    });
}

// Set position of marker and pan map to marker location
function placeMarkerAndPanTo(latLng, map, marker) {
    marker.setPosition(latLng);
    map.panTo(latLng);
}

// Set lat/lng fields of Point form based on marker's location
function setLatLng(latLng, latInput, lngInput) {
    const loc = JSON.parse(JSON.stringify(latLng.toJSON()));
}

document.addEventListener('DOMContentLoaded', initMap);