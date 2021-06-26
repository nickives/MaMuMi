import { Journey } from '/s/js/lib/journey.mjs'
import { Point } from '/s/js/lib/point.mjs'

/*
** View logic for the add-journey view
*/
let map;

// Create point
let _pointCreateBtn;
const markerArray = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("gmap"), {
        center: { lat: 53.0, lng: 9.0 },
        zoom: 4,
        styles: [
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
        ]
    });
}

/**
 * Create a new marker and add it to the map.
 * 
 * This method will create a new marker at the visible centre of the given map
 * and return the marker object.
 * 
 * @param {Map} map Google Maps object
 * @returns {Marker} Google Maps Marker
 */
function createNewMarker(map) {
    const marker = new google.maps.Marker({ map: map });
    marker.setPosition(map.getCenter());
    return marker;
}

// Will return an array of point objects
function getPoints() {
    const points = [];

    for (var i = 0; i < markerArray.length; ++i) {

        const pointNumber = i + 1;
        const latLng = markerArray[i].getPosition();

        const newPoint = new Point(
            null,
            pointNumber,
            {
                lat: latLng.lat(),
                lng: latLng.lng()
            },
        );

        points.push(newPoint);

    }
    return points;
}

/**
 * Iterates over the marker array makes only one marker movable / bouncing
 * 
 * @param {[Marker]} markerArray Array of Markers
 * @param {int} markerNumber Marker to set active
 */
function setActiveMarker(markerArray, markerNumber) {
    for (let i = 0; i < markerArray.length; ++i) {
        if (i === markerNumber) {
            markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
            markerArray[i].setDraggable(true);
        } else {
            markerArray[i].setAnimation(null);
            markerArray[i].setDraggable(false);
        }
    }
}

// ### Add new point to the form ###
function _appendPoint() {

    // create new marker
    const marker = createNewMarker(map);
    const markerNumber = markerArray.push(marker);
    setActiveMarker(markerArray, markerNumber - 1);
    marker.setLabel(markerNumber.toString());

    // create a new point row
    const tr = document.createElement('tr');
    tr.classList.add("shadow", "point");
    tr.setAttribute('id', 'point-row-' + markerNumber);

    const pointRow = `
        <td class='point-number'>${markerNumber}</td>
        <td></td>
        <td><a href="#" onclick="_deletePoint(${markerArray.length})">Delete</a></td>`;

    tr.innerHTML = pointRow;

    // move add point button to after this row
    _pointCreateBtn.parentElement.parentElement.before(tr);
}

/**
 * Delete a point
 */
function _deletePoint(pointNumber) {
    // remove the row
    document.getElementById('point-row-' + pointNumber).remove();
    // remove the marker
    const index = pointNumber - 1;
    markerArray[index].setMap(null)
    markerArray.splice(index, 1);

    // renumber the points
    const tableBody = Array.from(document.getElementById('point-body').children);
    let i = 1;
    for (let row of tableBody) {
        // the last row is the add button
        if (i !== tableBody.length) {
            row.setAttribute('id', 'point-row-' + i);
            const markerNumber = row.children[0];
            markerNumber.innerText = i;
    
            // update delete link
            const deleteLink = row.children[2].children[0];
            deleteLink.setAttribute('onclick', `_deletePoint(${i})`);

            // update marker labels as we go
            markerArray[i - 1].setLabel(i.toString());
            ++i;
        }
    };
}

// ### Submit journey to the db ###

function _createJourney() {
    const journeyForm = document.getElementById('journey-form');
    if (journeyForm.checkValidity()) {
        // construct journey
        const forename = document.getElementById('forename').value;
        const surname = document.getElementById('surname').value;
        const video_link = document.getElementById('video_link').value;
        const journey = new Journey(forename, surname, video_link);

        // construct descriptions
        const desc_en = document.getElementById('desc_en').value;
        const desc_es = document.getElementById('desc_es').value;
        const desc_bg = document.getElementById('desc_bg').value;
        const desc_el = document.getElementById('desc_el').value;
        const desc_no = document.getElementById('desc_no').value;
        const desc_it = document.getElementById('desc_it').value;
        const descriptions = {
            desc_en: desc_en,
            desc_es: desc_es,
            desc_bg: desc_bg,
            desc_el: desc_el,
            desc_no: desc_no,
            desc_it: desc_it
        };
        journey.addDescription(descriptions);

        getPoints().forEach(e => {
            journey.addPoint(e);
        });

        console.log(journey);
        _sendJourney(journey);
    } else {
        alert('invalid form');
    }
}

function _sendJourney(journeyObj) {
    console.log(JSON.stringify(journeyObj));
    fetch("/journeys", {
        method: "POST",
        mode: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(journeyObj),
    }).then((res) => {
        alert("Journey has been created");
    }).catch((error) => {
        alert(error.message);
    });
}


// ### Form layout and response code ###

document.addEventListener('DOMContentLoaded', initMap);

document.addEventListener('DOMContentLoaded', () => {

    _pointCreateBtn = document.getElementById("point-create-btn");
    _pointCreateBtn.addEventListener("click", _appendPoint);

    const _submitJourneyBtn = document.getElementById("journey-submit");
    _submitJourneyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        _createJourney();
    });

    _appendPoint();
});