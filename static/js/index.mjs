import Cookies from '/s/js/js.cookie.min.mjs'

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
    //map.data.addGeoJson(geoJSON);

    const journey = geoJSON.features[0].properties.journey;
    const point = journey.points[0]; // first Point

    document.getElementById('journey-name').innerText = journey.forename;

    const videoHTML = `<iframe class="video-iframe" width="560" height="315" src="${journey.video_link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    document.getElementById('journey-video-link').innerHTML = videoHTML;
    const description = document.getElementById('journey-description');
    const language = Cookies.get({ name: 'lang' });
    switch (language) {
        case 'es': description.innerHTML = journey.description.es;
        case 'el': description.innerHTML = journey.description.el;
        case 'bg': description.innerHTML = journey.description.bg;
        case 'no': description.innerHTML = journey.description.no;
        case 'it': description.innerHTML = journey.description.it;
        default: description.innerHTML = journey.description.en;
    }

    const marker = new google.maps.Marker({
        position: point.loc,
        map: map
    });

    const points = journey.points;
    for (let i = 0; i < journey.points.length; ++i) {

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
 * @param {Number} time   time in seconds for the pan to take.
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

    const framerate = 30;

    const steps = time * framerate;
    const latStep = (end.lat - start.lat) / steps;
    const lngStep = (end.lng - start.lng) / steps;

    const pos = {
        lat: 0,
        lng:0
    }

    pos.lat = start.lat;
    pos.lng = start.lng;

    const poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });
    poly.setMap(map);

    const path = poly.getPath();

    for (let i = 0; i <= steps; ++i) {
        pos.lat += latStep;
        pos.lng += lngStep;
        map.setCenter(pos);
        marker.setPosition(pos);
        path.push(new google.maps.LatLng(pos));
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
    const hidden = document.querySelector('#hidden-page').classList.remove('hidden');

    video.onended = function() {
        video.classList.add('hidden');
        document.querySelector('div.map').classList.remove('hidden');
    }
}

function changeLanguage(event) {
    console.log(event);``
}

function registerLanguageSelect() {
    const links = document.querySelectorAll('nav-link-lang');

    for (const l of links) {
        l.addEventListener('click', changeLanguage);
    }
}

window.onload = () => {
    animation();
    myMap();
    drawJourneyStarts();
    updateMap();
    registerLanguageSelect();
};
