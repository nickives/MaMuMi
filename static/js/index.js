
var map, geoJSON;
const mapMarkers = [];
var oldMarkerDesc = undefined;
var oldMarker = undefined;
var stopPan = false;

/**
 * Clear markers and close any InfoWindows
 * 
 * @param {google.maps.Marker} safeMarker Don't delete this marker.
 */
const clearMarkers = (safeMarker) => {
    // clear all markers
    mapMarkers.forEach(m => {
        if (m !== safeMarker) {
            m.setMap(null);
        }
    })

    // reset info window
    if (oldMarkerDesc !== undefined) {
        oldMarkerDesc.close();
    }
    oldMarkerDesc = undefined;

    // remove old geoJSON
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    })
}

const drawJourney = async (id) => {
    const res = await fetch('/journeys/' + id + '/geojson');
    const geoJSON = await res.json();
    clearMarkers();
    map.data.addGeoJson(geoJSON);

    const journey = geoJSON.features[0].properties.journey;
    const point = journey.points[0]; // first Point

    const marker = new google.maps.Marker({
        position: point.loc,
        map: map
    });

    const points = journey.points;
    for (i = 0; i < journey.points.length; ++i) {

        await panMap(map, marker, points[i].loc, points[i + 1].loc, 30);

    }
}

/**
 * Pan the map to the destination
 *
 * @param {Map}    map    Google Map
 * @param {Marker} marker Google Map Marker
 * @param {LatLng} start  Google Maps LatLng or LatLng literal 
 * @param {LatLng} end    Google Maps LatLng or LatLng literal
 * @param {int}    time   time in seconds for the pan to take.
 */
const panMap = async (map, marker, start, end, time) => {
    // take away user control
    map.setOptions(
        {
            draggable: false,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        }
    );
    map.setCenter(start);

    const framerate = 60;

    const steps = time * framerate;
    const latStep = (end.lat - start.lat) / steps;
    const lngStep = (end.lng - start.lng) / steps;

    const pos = {
        lat: 0,
        lng:0
    }

    pos.lat = start.lat;
    pos.lng = start.lng;

    for (i = 0; i <= steps; ++i) {
        pos.lat += latStep;
        pos.lng += lngStep;
        if (i % 2 == 0) map.panTo(pos);
        marker.setPosition(pos);
        await new Promise(resolve => setTimeout(resolve, 1000 / framerate));
    }

    // give it back
    map.setOptions(
        {
            draggable: true,
            zoomControl: true,
            scrollwheel: true,
            disableDoubleClickZoom: false
        }
    );
}

const drawJourneyStarts = async () => {
    clearMarkers();

    try {
        let res = await fetch('/journeys')
        let journeys = await res.json();

        journeys.forEach( (journey) => {
            if (journey.points !== undefined) {
                const marker = new google.maps.Marker({
                    position: journey.points[0].loc,
                    map: map,
                    journey: journey
                })
    
                mapMarkers.push(marker);

                marker.addListener('click', async () => {
                    await drawJourney(marker.journey.id);
                })
            }
        })
    } catch (err) {
        console.log(err);
    }
}

async function myMap() {

    const styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "hue": "#00ff39"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "color": "#e05858"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#3200ff"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "hue": "#00ffbf"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": "-16"
                    },
                    {
                        "hue": "#39ff00"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.landcover",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "color": "#fdf4f4"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.landcover",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#89e86e"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#92e88e"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#916464"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ],
        { name: "Styled Map" }
    );

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    map = new google.maps.Map(document.getElementById("gMap"), {
        center: { lat: 51.508742, lng: -0.120850 },
        zoom: 5,
        mapTypeControl: false,
        mapTypeControlOptions: {
        mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
        },
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
}

async function updateMap() {

    map.data.forEach(function (feature) {
        map.data.remove(feature);
    })

    // ### Display decription box for a marker ###
    //const markerDesc = new google.maps.InfoWindow();
}

async function animation() {
    const video = document.getElementById('loading-animation');

    video.classList.add('hidden');
    document.querySelector('div.map').classList.remove('hidden');

    video.onended = function() {
        video.classList.add('hidden');
        document.querySelector('div.map').classList.remove('hidden');
    }
}

window.onload = () => {
    animation();
    myMap();
    drawJourneyStarts();
    updateMap();
};
