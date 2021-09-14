import Cookies from '/s/js/js.cookie.min.mjs'

var map, panningMarker, panningLine;
const mapMarkers = [];
let stopJourney = false;
let isPanning = false;

/**
 * Clear markers and close any InfoWindows
 * 
 * @param {google.maps.Marker} safeMarker Don't delete this marker.
 */
const clearMap = (safeMarker) => {
    // clear all markers
    mapMarkers.forEach(m => {
        if (m !== safeMarker) {
            m.setMap(null);
        }
    });
}

const drawJourney = async (id) => {
    const res = await fetch('/journeys/' + id);
    const journey = await res.json();
    document.getElementById('journey-list').classList.add('hidden');
    document.getElementById('journey-display').classList.remove('hidden');
    clearMap();

    const point = journey.points[0]; // first Point

    document.getElementById('journey-name').innerText = journey.name;

    document.getElementById('journey-audio-player').src = journey.audio_uri;
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
        map: map,
        icon: '/s/img/pin_selected.png'
    });

    const points = journey.points;
    for (let i = 0; i < points.length - 1; ++i) {

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
async function panMap(map, marker, start, end, time) {
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

    isPanning = true;
    panningMarker = marker;
    panningLine = poly;
    for (let i = 0; i <= steps; ++i) {
        if (stopJourney || !isPanning) {
            stopJourney = false;
            marker.setMap(null);
            poly.setMap(null);
            break;
        } else {
            pos.lat += latStep;
            pos.lng += lngStep;
            map.setCenter(pos);
            marker.setPosition(pos);
            path.push(new google.maps.LatLng(pos));
            await new Promise(resolve => setTimeout(resolve, 1000 / framerate));
        }        
    }
    isPanning = false;

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
    clearMap();

    try {
        let res = await fetch('/journeys')
        let journeys = await res.json();

        journeys.forEach( (journey) => {
            if (journey.points !== undefined) {
                const marker = new google.maps.Marker({
                    position: journey.points[0].loc,
                    map: map,
                    journey: journey,
                    icon: '/s/img/pin.png'
                })

                const journeyRow = document.getElementById(`journey-row-${marker.journey.id}`);
                const playButton = journeyRow.childNodes[1];
                playButton.addEventListener('click', async () => {
                    await drawJourney(marker.journey.id);
                });

                marker.addListener('click', function () {
                    selectJourney(journeyRow);
                });

                mapMarkers.push(marker);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

async function myMap() {
    const style = await fetch('/s/js/map-style.json')
                    .then(function (response) { return response.json() });
    const styledMapType = new google.maps.StyledMapType(
        style,
        { name: "Styled Map" }
    );

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    map = new google.maps.Map(document.getElementById("gMap"), {
        center: { lat: 51.508742, lng: -0.120850 },
        zoom: 5,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
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

function changeLanguage(e) {
    const lang = e.target.attributes['data-lang'].value;
    Cookies.set('lang', lang);
    location.reload();
}

function registerLanguageSelect() {
    const links = document.querySelectorAll('.nav-link-lang');

    for (const l of links) {
        l.addEventListener('click', changeLanguage);
    }
}

function selectJourney(journeyRow) {
    if (selectJourney.selectedJourney !== undefined) {
        selectJourney.selectedJourney.classList.remove('journey-selected');
        selectJourney.selectedJourney.childNodes[1].classList.add('hidden'); // play button
        selectJourney.marker.setIcon('/s/img/pin.png');
    }

    selectJourney.selectedJourney = journeyRow;
    selectJourney.selectedJourney.classList.add('journey-selected');

    selectJourney.selectedJourney.childNodes[1].classList.remove('hidden');

    const id = selectJourney.selectedJourney.attributes['data-id'].value;

    const marker = mapMarkers.find(marker => marker.journey.id == id);
    marker.setIcon('/s/img/pin_selected.png');
    selectJourney.marker = marker;
    const journey = marker.journey;

    map.panTo(marker.getPosition());
}

function registerJourneySelect() {
    const journeys = document.querySelectorAll('.journey-item');
    for (const j of journeys) {
        j.addEventListener('click', (e) => {
            selectJourney(e.currentTarget);
        });
    }
}

function closeJourney() {
    if (isPanning) stopJourney = true;
    if (panningMarker) panningMarker.setMap(null);
    if (panningLine) panningLine.setMap(null);
    drawJourneyStarts();
    document.getElementById('journey-display').classList.add('hidden');
    document.getElementById('journey-list').classList.remove('hidden');
}

window.onload = async () => {
    animation();
    await myMap();
    drawJourneyStarts();
    //updateMap();
    registerLanguageSelect();
    registerJourneySelect();

    document.getElementById('close-journey').addEventListener('click', closeJourney);
};
