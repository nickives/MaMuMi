
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
}

const addPoints = (journey) => {
}


const drawInfoWindow = (marker, point_num) => {
    const markerDesc = new google.maps.InfoWindow();
    oldMarkerDesc = markerDesc;
    var desc = marker.journey.points[point_num].description.en;
    markerDesc.setContent("<div id=\"infoWindow\">"+desc+"</div>");
    markerDesc.setPosition(marker.getPosition());
    markerDesc.setOptions({pixelOffset: new google.maps.Size(0,-50)});
    markerDesc.open(map);
}


const drawJourney = async (id) => {

    let res = await fetch('/journeys/' + id + '/geojson');
    let geoJSON = await res.json();

    // remo
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    })
    map.data.addGeoJson(geoJSON);
    clearMarkers();

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
            drawInfoWindow(marker);
        }

        mapMarkers.push(marker);

        const point_num = p.point_num;
        marker.addListener('click', () => {
            console.log(point_num);
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
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "hue": "#00ff1a"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
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

    /*
    $.getJSON("http://" + location.hostname + ":" + location.port + "/journeys", function(data) {
        geoJSON = data;
        map.data.addGeoJson(data);
        
        // Animate middle marker. All this is hacked together from /journeys 
        // JSON. Sort out how this will really work!
        
        midpoint = data.features[2].properties.midpoint;
        marker = new google.maps.Marker({
            map,
            animation: google.maps.Animation.BOUNCE,
            position: { lat: midpoint[1], lng: midpoint[0] },
        })

        // we have to add callbacks seperately for animated markers
        marker.addListener('click', function(event) {
            var desc = data.features[2].properties.description;
            markerDesc.setContent("<div>"+desc+"</div>");
            markerDesc.setPosition(marker.getPosition());
            markerDesc.setOptions({pixelOffset: new google.maps.Size(0,-50)});
            markerDesc.open(map);
        })
    })

    

    // When the user clicks on a marker get the description
    // json and display it
    map.data.addListener('click', function(event) {
        var desc = event.feature.getProperty("description");
        markerDesc.setContent("<div>"+desc+"</div>");
        markerDesc.setPosition(event.feature.getGeometry().get());
        markerDesc.setOptions({pixelOffset: new google.maps.Size(0,-50)});
        markerDesc.open(map);
    });*/
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
