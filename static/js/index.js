
var map, geoJSON;
const mapMarkers = [];
var oldMarkerDesc = undefined;
var oldMarker = undefined;

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

const addPoints = (journey) => {
}

const pointWindowContent = (point) => {
    let desc = point.description.en;
    let vidUrl = point.video_link;

    return `<div id=\"infoWindow\">
                <div id=\"infoDescription\">"${desc}"</div>
                <div id=\"infoVideo\"><iframe width="560" height="315" src="${vidUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
            </div>`;
}

const drawInfoWindow = (marker, point_num) => {
    const markerDesc = new google.maps.InfoWindow();
    oldMarkerDesc = markerDesc;
    let point = marker.journey.points[point_num];
    markerDesc.setContent(pointWindowContent(point));
    markerDesc.setPosition(marker.getPosition());
    markerDesc.setOptions({pixelOffset: new google.maps.Size(0,-50)});
    markerDesc.open(map);
}


const drawJourney = async (id) => {


    let res = await fetch('/journeys/' + id + '/geojson');
    let geoJSON = await res.json();
    clearMarkers();
    map.data.addGeoJson(geoJSON);

    const journey = geoJSON.features[0].properties.journey;
    journey.points.forEach( p => {
        const marker = new google.maps.Marker({
            position: p.loc,
            map: map,
            journey: journey
        });

        // first point of journey should be bouncing and have info window
        if (p.point_num === 1) {
            oldMarker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            drawInfoWindow(marker, 0);
        }

        mapMarkers.push(marker);

        const point_num = p.point_num  - 1;
        marker.addListener('click', () => {
            if (oldMarkerDesc !== undefined) {
                oldMarkerDesc.close();
            }
            // clear previous bouncing and set this one bouncing
            oldMarker.setAnimation(null);
            oldMarker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);

            drawInfoWindow(marker, point_num);
        })
    })
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
    const markerDesc = new google.maps.InfoWindow();
}

async function animation() {
    const video = document.getElementById('loading-animation');

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
