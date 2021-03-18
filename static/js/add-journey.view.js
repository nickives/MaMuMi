/*
** View logic for the add-journey view
*/
let _markerArray = {};
let _markerNumber;

// Create point
let _pointCreateBtn;
let _pointList;

// Read 
let _points = [];

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


// ### Marker and Map ###

    map.setOptions({ disableDoubleClickZoom: true });

    const latInput = document.getElementById("lat");
    const lngInput = document.getElementById("lng");

    map.addListener("dblclick", (e) => {
        console.log(_markerNumber);
         if (_markerArray[_markerNumber] !== undefined) {
            placeMarkerAndPanTo(e.latLng, map, _markerArray[_markerNumber]);
            setLatLng(e.latLng, latInput, lngInput);
        } else {
            createNewMarker(e.latLng, map);
        }

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

function togglePointForm() {

}

// Return the size of a given map
function getMapSize(x) {
    var len = 0;
    for (var count in x) {
            len++;
    }
    return len;
}

// add a new marker to the map and add it to the marker array
function createNewMarker(latLng, map) {
    var key = getMapSize(_markerArray) + 1;
    _markerArray[key] = new google.maps.Marker({ map: map });
    placeMarkerAndPanTo(latLng, map, _markerArray[key]);
}


// ### Add new point to the form ###

function _appendPoint(pointObj) {

    const tr = document.createElement('tr');
    tr.classList.add("shadow", "point");
    if (pointObj.point_num !== undefined ) {
        _markerNumber = pointObj.point_num;
    } else {
        _markerNumber = getMapSize(_markerArray) + 1;
    }


    const pointHeader = `
        <td>${_markerNumber}</td>
        <td>${pointObj.arrival_date}</td>
        <td>${pointObj.departure_date}</td>
        <td></td>
        <td>
            <button type="button" class="btn btn-sm">O</button>
        </td>
    `;

    tr.innerHTML = pointHeader;

    const trBody = document.createElement('tr');
    trBody.classList.add("point-form");

    const pointBody = `
        <td colspan="100%">
            <div class="form-container">
                <div class="form-title d-flex flex-row justify-content-between p-2 mb-2 border-bottom">
                    <h3 class="h6 m-0">Pin Location</h3>
                    <small>Required</small>
                </div>

                <div class="form-group-container">
                    <div class="form-group row m-0">
                        <input type="text" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="form-title d-flex flex-row justify-content-between p-2 mb-2 border-bottom">
                    <h3 class="h6 m-0">Description</h3>
                    <small>Required</small>
                </div>

                <div class="form-group-container">
                    <textarea class="form-control form-control-sm">
                    </textarea>
                </div>                    

                <div class="form-title d-flex flex-row justify-content-between p-2 mb-2 border-bottom">
                    <h3 class="h6 m-0">Arrival Departure Dates</h3>
                    <small>Required</small>
                </div>

                <div class="form-group-container form-row">
                    <div class="col">
                        <input type="date" class="form-control form-control-sm">
                    </div>

                    <div class="col">
                        <input type="date" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="form-title d-flex flex-row justify-content-between p-2 mb-2 border-bottom">
                    <h3 class="h6 m-0">Video URL</h3>
                    <small>Required</small>
                </div>

                <div class="form-group-container>
                    <div class="form-group row m-0">
                        <input type="url" class="form-control form-control-sm">
                    </div>
                </div>
            </div
        </td>
    `;

    trBody.innerHTML = pointBody;


    _pointCreateBtn.parentElement.parentElement.before(tr);
    _pointCreateBtn.parentElement.parentElement.before(trBody);

}

// ### Submit journey to the db ###

function _createJourney() {
    const forename;
    const surname;
    const journey = new Journey(forename, surname, null);


}


// ### Form layout and response code ###

document.addEventListener('DOMContentLoaded', initMap);

document.addEventListener('DOMContentLoaded', () => {
    
    _pointList = document.querySelector("tbody");

    _pointCreateBtn = document.getElementById("point-create-btn");
    _pointCreateBtn.addEventListener("click", _appendPoint);

    document.querySelectorAll('.point-form').forEach((e) => {
        $(e).toggle();
    });

    document.querySelector('tbody').addEventListener('click', (e) => {
        if (e.target.nodeName !== "BUTTON") {
            _markerNumber = e.target.parentNode.childNodes[1].innerText;
            
            const form = e.target.parentElement.nextElementSibling;
            $(form).toggle(300);
        }
    });
});