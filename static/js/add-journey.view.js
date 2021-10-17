import { Journey } from '/s/js/lib/journey.mjs'
import { Point } from '/s/js/lib/point.mjs'

/*
** View logic for the add-journey view
*/
let map;

// Create point
let _pointCreateBtn;
const markerArray = [];

async function initMap() {
    const style = await fetch('/s/js/map-style.json')
                        .then(function (response) { return response.json() });

    const styledMapType = new google.maps.StyledMapType(
        style,
        { name: "Styled Map" }
    );

    map = new google.maps.Map(document.getElementById("gmap"), {
        center: { lat: 53.0, lng: 9.0 },
        zoom: 4
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
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
        <td><a href="#" data-point-num="${markerNumber}">Delete</a></td>`;

    tr.innerHTML = pointRow;

    const deleteLink = tr.children[2].children[0];

    deleteLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetMarkerNumber = parseInt(e.target.getAttribute('data-point-num'));
        _deletePoint(targetMarkerNumber);
    });


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
            deleteLink.setAttribute('data-point-num', i.toString());

            // update marker labels as we go
            markerArray[i - 1].setLabel(i.toString());
            ++i;
        }
    };
}

// ### Submit journey to the db ###

function _createJourney(isUpdate) {
    const journeyForm = document.getElementById('journey-form');
    if (markerArray.length < 2) {
        alert('Journey requires start and finish!');
    } else if (journeyForm.checkValidity()) {
        
        // construct names
        const names = {
            en: document.getElementById('name_en').value,
            es: document.getElementById('name_es').value,
            el: document.getElementById('name_el').value,
            bg: document.getElementById('name_bg').value,
            no: document.getElementById('name_no').value,
            it: document.getElementById('name_it').value,
        }
        
        // construct subtitles
        const subtitles = {
            en: document.getElementById('subtitle_en').value,
            es: document.getElementById('subtitle_es').value,
            el: document.getElementById('subtitle_el').value,
            bg: document.getElementById('subtitle_bg').value,
            no: document.getElementById('subtitle_no').value,
            it: document.getElementById('subtitle_it').value,            
        }
        
        // construct descriptions
        const descriptions = {
            en: document.getElementById('desc_en').value,
            es: document.getElementById('desc_es').value,
            el: document.getElementById('desc_el').value,
            bg: document.getElementById('desc_bg').value,
            no: document.getElementById('desc_no').value,
            it: document.getElementById('desc_it').value
        };
        // construct journey
        const journey = new Journey(names, subtitles, null);
        journey.order = document.getElementById('order').value;
        journey.addDescription(descriptions);

        getPoints().forEach(e => {
            journey.addPoint(e);
        });

        const audioFile = document.getElementById('audio_file').files[0];
        const oldAudioUri = document.getElementById('old-audio-uri');
        const formData = new FormData();

        if (isUpdate) {
            if (audioFile) {
                formData.append('audio_file', audioFile);
            } else {
                journey.audio_uri = oldAudioUri.value;
            }
        } else {
            formData.append('audio_file', audioFile);
        }

        formData.append('journey', JSON.stringify(journey));
        
        const id = document.getElementById('journey-id').value;
        const fetchUrl = isUpdate ? `/admin/journey/${id}/update` : "/admin/journey/create";
        fetch(fetchUrl, {
            method: "POST",
            mode: "same-origin",
            body: formData
        }).then((res) => {
            if (res.status !== 200) {
                alert("Server Error");
            } else if (isUpdate) {
                alert("Journey has been updated");
                location.reload();
            } else {
                alert("Journey has been created");
            }
        }).catch((error) => {
            alert(error.message);
        });
    } else {
        alert('invalid form');
    }
}

// ### Form layout and response code ###

window.onload = async () => {
    await initMap();
    _pointCreateBtn = document.getElementById("point-create-btn");
    _pointCreateBtn.addEventListener("click", _appendPoint);

    const _submitJourneyBtn = document.getElementById("journey-submit");
    _submitJourneyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isUpdate = _submitJourneyBtn.dataset.update !== undefined;
        _createJourney(isUpdate);
    });

    const oldPoints = document.getElementById('old-points');
    if (oldPoints !== null) {
        const points = JSON.parse(oldPoints.value);
        points.sort( (a, b) => {
            return a.point_num - b.point_num;
        })

        let i = 0;
        for (const p of points) {
            _appendPoint();
            markerArray[i].setPosition(p.loc);
            ++i
        }
    } else {
        _appendPoint();
    }
}