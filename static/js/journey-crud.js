/*
 * Handle CRUD operations for Journeys within admin dashboard
 */
(function () {
    "use strict";


    // Defining vars
    let _pointCount = 0;
    let _btnPressCount = 0;
    let _listPane;
    // Create Journey
    let _createBtn;
    let _creationPane;
    let _creationForm;
    let _tableContainer;
    let _journeyList;
    let _journeyCreateBtn;
    
    // Create point
    let _pointCreateForm;
    let _pointCreateBtn;

    // Read 
    let _pointList;
    let _points = [];
    let _journeys = [];

    document.addEventListener("DOMContentLoaded", () => {
        _createBtn = document.getElementById("pane-switch-btn");
        _listPane = document.getElementById("journey-list");
        _creationPane = document.getElementById("create-journey");
        _creationForm = document.querySelector("#create-journey form");
        _tableContainer = document.querySelector(".table-responsive");
        _journeyList = document.querySelector("#journey-list tbody");
        _pointCreateForm = document.getElementById("point-create-form");
        _pointCreateBtn = document.getElementById("point-create-btn");
        _pointList = document.querySelector("#point-options table");
        _journeyCreateBtn = document.getElementById('submit-journey-btn');

        _displayJourneys();
        _createBtn.addEventListener("click", _altPane);
        _pointCreateBtn.addEventListener("click", _createPoint);
        _journeyCreateBtn.addEventListener("click", _createJourney);
        _journeyList.addEventListener("click", _journeyListHandler);
        _pointList.addEventListener("click", _pointFormhandler);
    });

    async function _getJourneys() {
        return await (await fetch("/journeys")).json();
    }

    async function _getJourney(id) {
        return await (await fetch(`/journeys/${id}`)).json();
    }

    async function _sendJourney(journeyObj) {
        fetch("/journeys", {
            method: "POST",
            mode: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(journeyObj),
        })
            .then((res) => {
                alert("Journey created!");
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    async function _updateJourney(journeyID, journeyObj) {
        fetch(`/journeys/${journeyID}/update`, {
            method: "POST",
            mode: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(journeyObj),
        })
            .then((res) => {
                alert("Journey successfully updated!");
            })
            .catch((error) => {
                alert("Journey update failed!");
            });
    }

    async function _deleteJourney(journeyID) {
        fetch(`/journeys/${journeyID}/delete`, {
            method: "POST",
            mode: "same-origin",
            body: ""
        })
            .then((res) => {
                alert("Journey deleted!");
            })
            .catch((error) => {
                alert("Journey deletion failed!");
            });
    }

    function _displayJourneys() {
        _journeyList.innerHTML = '';

        _getJourneys().then((journeys) => {
            if (journeys.length > 0) {

                journeys.forEach((e) => {
                    _getJourney(e.id).then((journey) => {
                        _journeys.push(journey);
                        _appendJourney(journey);
                    })
                });

            } else {
                _tableContainer.innerText =
                    "No journeys added yet. Click the create button to get started.";
            }
        });
    }

    function _altPane(event) {
        if (!(++_btnPressCount % 2 == 0)) {
            // Odd
            _createBtn.innerText = "List";
            _creationPane.classList.add("active-pane");
            _listPane.classList.remove("active-pane");
        } else {
            // Even
            _createBtn.innerText = "Create";
            _creationPane.classList.remove("active-pane");
            _listPane.classList.add("active-pane");
        }

        event.preventDefault();
    }

    /**
     * Create a point
     */
    function _createPoint(event) {
        if (_pointCreateForm.reportValidity()) {
            const lat = document.getElementById("lat").value;
            const lng = document.getElementById("lng").value;
            const videoLink = document.getElementById("video-link").value;
            const arrivalDate = document.getElementById("arrival").value;
            const departureDate = document.getElementById("departure").value;
            const desc = document.getElementById("desc").value;

            const newPoint = new Point(
                null,
                ++_pointCount,
                { lat: lat, lng: lng },
                videoLink,
                arrivalDate,
                departureDate
            );

            // English added for demonstration purposes - fixed with full localisation
            if (desc.length > 1) {
                newPoint.addDescription({ en: desc });
            }

            $('#point-form').modal('hide');
            _clearPointForm();
            _appendPoint(newPoint);
            initMap();
        }
    }

    /**
     * Clear the points form 
     */
    function _clearPointForm() {
        const inputs = document.getElementById('point-form').getElementsByTagName('input');
        const desc = document.getElementById("desc");

        Array.from(inputs).forEach(e => {
            e.value = '';
        });

        desc.value = '';
    }

    /**
     * Add a point object to the point form
     * 
     * @param {*} pointObj 
     */
    function _appendPoint(pointObj) {
        const tdHtml = `
            <tr>
                <td>${pointObj.point_num}</td>
                <td>${pointObj.arrival_date}</td>
                <td>${pointObj.departure_date}</td>
                <td><button type="button" class="btn btn-sm btn-outline-danger border-0">X</button></td>
            </tr>
        `;

        _points.push(pointObj);
        _pointList.querySelector('tbody').innerHTML += tdHtml;
    }

    /**
     * Remove a point from a journey
     * 
     *  THIS DOES NOT UPDATE LATER POINT NUMBERS
     * 
     * @param {*} event 
     */
    function _pointFormhandler(event) {
        const tr = event.target.parentNode.parentNode;
        const pointNumber = tr.childNodes[1].innerText;

        if (event.target.tagName === 'TD') {
            // View/Update
        } else if (event.target.tagName === 'BUTTON') {

            // remove the point from the points array
            _points = _points.filter(function(point) {
                if (point.point_num != pointNumber) {
                    return point;
                }
            });

            // Delete from the view
            tr.parentNode.removeChild(tr);
        }
    }
    

    function _createJourney() {

        if (_creationForm.reportValidity() && _points.length > 0) {
            const forename = document.getElementById('forename').value;
            const surname = document.getElementById('surname').value;
            const journey = new Journey(forename, surname, null);

            _points.forEach(e => {
                journey.addPoint(e);
            });

            _sendJourney(journey).then(() => {
                _clearJourneyForm();
                _displayJourneys();
            });


        } else if (!(_points.length > 0)) {
            alert("Add at least one point to Journey to save!");
        }
    }

    // TODO: Refactor this function into generalised input clearing function + remove other clearing func
    function _clearJourneyForm() {
        const inputs = document.getElementById('journey-options').getElementsByTagName('input');

        Array.from(inputs).forEach(e => {
            e.value = '';
        });

        _pointList.querySelector('tbody').innerHTML = '';
    }

    function _appendJourney(journeyObj) {
        const tdHtml = `
        <tr>
            <td>${journeyObj.id}</td>
            <td>${journeyObj.forename}</td>
            <td>${journeyObj.surname}</td>
            <td>${journeyObj.points.length}</td>
            <td><button type="button" class="btn btn-sm btn-outline-danger border-0">X</button></td>
        </tr>
    `;

        _journeyList.innerHTML += tdHtml;
    }

    function _journeyListHandler(event) {
        const tr = event.target.parentNode.parentNode;
        const journeyID = tr.childNodes[1].innerText;

        if (event.target.tagName === 'TD') {
            // View/Update
            _getJourney(journeyID).then(journey => {
                _viewJourney(journey);
                _altPane();
            })
        } else if (event.target.tagName === 'BUTTON') {
            // Delete
            tr.parentNode.removeChild(tr);
            _deleteJourney(journeyID);
        }
    }

    function _viewJourney(journeyObj) {
        document.getElementById('forename').value = journeyObj.forename;
        document.getElementById('surname').value = journeyObj.surname;

        journeyObj.points.forEach((point) => {
            _appendPoint(point);
        });
    }
})();

// Callback function called by inline Google maps script
function initMap() {
    map = new google.maps.Map(document.getElementById("gmap"), {
        center: { lat: 53.0, lng: 9.0 },
        zoom: 2,
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
    latInput.value = loc.lat;
    lngInput.value = loc.lng;
}
