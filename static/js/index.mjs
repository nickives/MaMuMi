import Cookies from '/s/js/js.cookie.min.mjs'

function animation() {
    const video = document.getElementById('loading-animation');
    const hideVideo = () => {
        video.classList.add('hidden');
        document.body.removeEventListener('dblclick', hideVideo);
        document.querySelector('#hidden-page').classList.remove('hidden');
    }

    document.body.addEventListener('dblclick', hideVideo);

    //video.classList.add('hidden'); // remove this to re-enable animation!
    //document.querySelector('#hidden-page').classList.remove('hidden');

    video.onended = function() {
        video.classList.add('hidden');
        document.querySelector('#hidden-page').classList.remove('hidden');
        document.body.removeEventListener('dblclick', hideVideo);
    }
}

/**
 * MyMap - Google Maps wrapper class.
 * 
 * This class should not be instantiated directly because it requires
 * asyncronous construction. Use the build() method to get a promise that
 * will resolve to a properly constructed map.
 */
class MyMap {
    /**
     * MyMap - Private constructor
     * 
     * JavaScript doesn't enforce private members, so please just don't call
     * this directly.
     * 
     * @param gMap - Properly constructed google maps element.
     */
    constructor(gMap) {
        if (typeof gMap === undefined) {
            throw new Error('Cannot be instantiated directly');
        }
        this.map = gMap;            // Google Maps object
        this.mapMarkers = [];       // All map markers
        this.isPanning = false;     // Panning flag - used to pause / resume
        this.isStopping = false;    // Stopping flag - used to stop panning
        this.framerate = 60;
    }

    static async build(mapElement) {
        
        // if we used webpack we could just include this
        const style = await fetch('/s/js/map-style.json')
                            .then(function (response) { return response.json() });

        const styledMapType = new google.maps.StyledMapType(
            style,
            { name: "Styled Map" }
        );

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        const gMap = new google.maps.Map(mapElement, {
                center: { lat: 51.508742, lng: -0.120850 },
                zoom: 5,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            }
        );

        //Associate the styled map with the MapTypeId and set it to display.
        gMap.mapTypes.set("styled_map", styledMapType);
        gMap.setMapTypeId("styled_map");

        return new MyMap(gMap);
    }

    /**
     * Pan the map to the destination(s), moving the marker and drawing a line
     *
     * @param {Marker} marker           Google Map Marker at the start position
     * @param {[LatLng]} destinations   Array of Google Maps LatLng or LatLng literals
     * @param {Number} time             Time in seconds for the pan to take.
     * @param {String} lineColor        Hex string representation of desired color
     * 
     * @return {Marker, Poly} Object containing the drawn marker and polylines
     */
    async animateMap(marker, destinations, time, lineColor) {

        // BIG BRAIN REFACTOR REALISATION
        // This should all be scrapped and instead we should just update the map based on the
        // timeupdate event from the HTMLMediaElement.
        if (this.isPanning) return; // don't attempt to pan twice
        // take away user control
        this.map.setOptions(
            {
                draggable: false,
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true
            }
        );

        const start = marker.getPosition();
        this.map.panTo(start);
        this.map.setZoom(7);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const sillyCorrection = Math.floor(time * .95); // take 
        const framerate = this.framerate;
        const steps = sillyCorrection * framerate;

        // calculate total distance and length of each leg
        let totalDistance = 0;
        let lastPos = {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        }
        destinations.forEach(d => {
            const currentPos = d.loc;
            const latDifference = Math.abs(currentPos.lat - lastPos.lat);
            const lngDifference = Math.abs(currentPos.lng - lastPos.lng);
            const currentDistance = hypotenuseDistance(latDifference, lngDifference);

            totalDistance += currentDistance;   // total distance
            currentPos.distance = currentDistance;       // save this leg distance
            lastPos = currentPos;
        });

        // Proportion the number of steps across each leg
        lastPos = {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        }
        destinations.forEach(d => {
            const currentPos = d.loc;
            const fraction = currentPos.distance / totalDistance;
            currentPos.steps = steps * fraction;
            currentPos.latStep = (currentPos.lat - lastPos.lat) / currentPos.steps;
            if (isNaN(currentPos.latStep)) currentPos.latStep = 0;
            currentPos.lngStep = (currentPos.lng - lastPos.lng) / currentPos.steps;
            if (isNaN(currentPos.lngStep)) currentPos.lngStep = 0;
            lastPos = currentPos;
        })

        const pos = {
            lat: start.lat(),
            lng: start.lng(),
        }

        const poly = new google.maps.Polyline({
            strokeColor: lineColor,
            strokeOpacity: 1.0,
            strokeWeight: 8,
        });
        poly.setMap(this.map);

        const path = poly.getPath();

        this.isPanning = true;
        this.isStopping = false;
        for (let x = 0; x < destinations.length; ++x) {
            const d = destinations[x];
            for (let i = 0; i < d.loc.steps; ++i) {
                if (this.isStopping) {
                    // If we have to stop
                    //marker.setMap(null);
                    poly.setMap(null);
                    marker.setPosition(start);
                    break;
                } else if (this.isPanning) {
                    pos.lat += d.loc.latStep;
                    pos.lng += d.loc.lngStep;
                    this.map.setCenter(pos);
                    marker.setPosition(pos);
                    path.push(new google.maps.LatLng(pos));
                    await new Promise(resolve => setTimeout(resolve, 1000 / framerate));
                } else {
                    // Not panning, not stopping, so paused
                    --i;
                    await new Promise(resolve => setTimeout(resolve, 1000 / framerate));
                }     
            }
        }

        // give it back
        this.map.setOptions(
            {
                draggable: true,
                zoomControl: true,
                scrollwheel: true,
                disableDoubleClickZoom: false
            }
        );
        this.isPanning = false;
        this.isStopping = false;

        return {
            marker: marker,
            poly: poly
        }
    }


    /**
     * Clear map of all markers. Stops panning if in progress. Optionally
     * keep a marker.
     * 
     * @param safeMarker Marker that will not get removed
     */
    clearMap(safeMarker) {
        this.stopPan();
        // clear all markers
        this.mapMarkers.forEach(m => {
            if (m !== safeMarker) {
                m.setMap(null);
            }
        });
    }

    /**
     * Pause panning. Can be resumed with resumePan().
     */
    pausePan() {
        this.isPanning = false;
    }

    /**
     * Resume panning after pausePan()
     */
    resumePan() {
        this.isPanning = true;
    }

    /**
     * Stop panning. Completely stops panning and removes marker / line.
     */
    stopPan() {
        this.isStopping = true;
    }

    getMapMarkers() {
        return this.mapMarkers;
    }

    getMap() {
        return this.map;
    }
}

class IndexPage {
    /**
     * 
     * @param {MyMap} myMap 
     */
    constructor(myMap) {
        this.myMap = myMap;
        this.selectedJourneyRow = undefined;
        this.marker = undefined;
        this.audioPlayer = undefined;
        this.selectedJourney = undefined;
        this.registerJourneySelect();
        IndexPage.registerLanguageSelect();
        this.drawMapMarkers();

        // we have two close journey buttons, one for desktop other for mobile
        const closeJourneyButtons = document.getElementsByClassName('close-journey-btn');
        for (let i = 0; i < closeJourneyButtons.length; ++i) {
            closeJourneyButtons.item(i).addEventListener('click', this.closeJourney);
        }

        // Colors for the journey lines
        this.journeyColors = [
            "#fff275","#fbc2b5","#9c569c","#ff0000","#d95c9c",
            "#e3b505","#594a26","#89fc00","#333333","#e8ddb5"
        ];
        this.currentJourneyColor = 0;
        this.displayedJourneys = []; // we store {Map, Poly} objects here when finished animating the map
    }

    /**
     * IndexPage static factory method.
     * 
     * This is required because the process of fetching the map markers is
     * async. The fetch should happen once because we need to attach event
     * listeners to them, so rather than deal with setting / clearing event
     * listeners we fetch once and then show / hide as required.
     * 
     * @param {MyMap} myMap MyMap object
     * @returns {IndexPage} Constructed IndexPage
     */
    static async build(myMap) {
        const indexPage = new IndexPage(myMap);
        await indexPage._getMapMarkers();
        return indexPage;
    }

    /**
     * Private: Get map makers from server.
     * 
     * Here we get the markers and attach all required event listeners. Calling
     * this multiple times will result in redundent event listeners being
     * attached to page elements and subsequent strange behaviour. It should
     * only be called once during page construction.
     */
    async _getMapMarkers() {
        try {
            let res = await fetch('/journeys')
            let journeys = await res.json();
    
            journeys.forEach( (journey) => {
                if (journey.points !== undefined) {
                    const marker = new google.maps.Marker({
                        position: journey.points[0].loc,
                        map: this.myMap.getMap(),
                        journey: journey,
                        icon: '/s/img/pin.png'
                    })
    
                    const journeyRow = document.getElementById(`journey-row-${marker.journey.id}`);
                    const playButton = journeyRow.childNodes[2].childNodes[0];
                    playButton.addEventListener('click', () => {
                        this.displayJourney(marker.journey.id);
                    });

                    marker.addListener('click', () => {
                        this.displayJourney(marker.journey.id);
                    });
    
                    this.myMap.getMapMarkers().push(marker);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    drawMapMarkers() {
        this.myMap.clearMap();
        this.myMap.getMapMarkers().forEach( (m) => {
            m.setMap(this.myMap.getMap());
        });
    }

    async displayJourney(id) {
        if (typeof id === 'string') id = parseInt(id);
        const res = await fetch('/journeys/' + id);
        const journey = await res.json();
        this.selectedJourney = journey;
        document.getElementById('journey-list').classList.add('hidden');
        document.getElementById('journey-display').classList.remove('hidden');
        const safeMarker = this.myMap.getMapMarkers().find( e => e.journey.id === id);
        this.myMap.clearMap(safeMarker);
        this.selectedJourney.marker = safeMarker;
        this.myMap.getMap().setCenter(safeMarker.getPosition());
        const cookieLang = Cookies.get('lang');
        const lang = (cookieLang) ? cookieLang : 'en';
    
        document.getElementById('journey-name').innerText = journey.name[lang];
        document.getElementById('journey-subtitle').innerText = journey.subtitle[lang];
    
        document.getElementById('journey-audio-player').src = journey.audio_uri;
        const description = document.getElementById('journey-description');
        const language = Cookies.get('lang');
        switch (language) {
            case 'es':
                description.innerHTML = journey.description.es;
                break;
            case 'el':
                description.innerHTML = journey.description.el;
                break;
            case 'bg':
                description.innerHTML = journey.description.bg;
                break;
            case 'no':
                description.innerHTML = journey.description.no;
                break;
            case 'it':
                description.innerHTML = journey.description.it;
                break;
            default: description.innerHTML = journey.description.en;
        }
    
        const audioElement = document.getElementById('journey-audio-player');
        this.audioPlayer = new AudioPlayer(audioElement, journey.audio_uri);
        this.audioPlayer.registerPlayCallback(this.playCallback);
        this.audioPlayer.registerPauseCallback(this.pauseCallback);
        this.audioPlayer.registerPlayingCallback(this.playingCallback);
        this.audioPlayer.registerStopCallback(this.stopCallback);

        await new Promise(resolve => setTimeout(resolve, 500));
        this.audioPlayer.play();
    }

    /**
     * Play callback.
     * 
     * This should be called when the HTMLAudioElement has commenced playing.
     * 
     * @param {HTMLAudioElement} player HTMLAudioElement that is playing
     */
    playCallback = async (player) => {
        const journey = this.selectedJourney;
        const journeyColor = this.journeyColors[this.currentJourneyColor];

        // If this journey was already played, clear it before playing again
        this.displayedJourneys.filter( (e) => {
            if (e.marker.journey.id === journey.id) {
                e.poly.setMap(null);
                const start = e.marker.journey.points[0].loc;
                e.marker.setPosition(start);
                return false;
            } else {
                return true;
            }
        });
        const completedJourney = await this.myMap.animateMap(journey.marker, journey.points, player.duration, journeyColor);

        // if it didn't get stopped
        if (completedJourney) {
            this.displayedJourneys.push(completedJourney);
        }
        
        // Loop through all the colours 
        if (this.currentJourneyColor === this.journeyColors.length - 1) {
            this.currentJourneyColor = 0;
        } else {
            ++this.currentJourneyColor;
        }
    }

    /**
     * Pause callback.
     * 
     * This should be called when the player has paused for any reason.
     */
    pauseCallback = () => {
        this.myMap.pausePan();
    }

    /**
     * Playing callback.
     * 
     * This should be called when the player has resumed playing after a pause.
     */
    playingCallback = () => {
        this.myMap.resumePan();
    }

    stopCallback = () => {
        this.myMap.stopPan();
        this.selectedJourney.marker = null;
    }

    closeJourney = () => {
        if (this.audioPlayer) this.audioPlayer.destroy();
        this.myMap.stopPan();
        this.drawMapMarkers();
        this.audioPlayer = undefined;
        document.getElementById('journey-display').classList.add('hidden');
        document.getElementById('journey-list').classList.remove('hidden');
    }

    registerJourneySelect() {
        const journeys = document.querySelectorAll('.journey-item');
        for (const j of journeys) {
            j.addEventListener('click', (e) => {
                const id = e.currentTarget.attributes['data-id'].value;
                this.displayJourney(id); // we now display journey. Selection is gone
            });
        }
    }

    static registerLanguageSelect() {
        const links = document.querySelectorAll('.nav-link-lang');
    
        for (const l of links) {
            l.addEventListener('click', IndexPage.changeLanguage);
        }
    }

    static changeLanguage(e) {
        const lang = e.target.attributes['data-lang'].value;
        Cookies.set('lang', lang);
        location.reload();
    }
}

class AudioPlayer {
    constructor(audioPlayerElement, audioResource) {
        this.audioPlayer = new Audio(audioResource);
        this.playButton = audioPlayerElement.children['play-button'];
        //this.pauseButton = audioPlayerElement.children['pause-button'];
        //this.stopButton = audioPlayerElement.children['stop-button'];
        //this.currentTime = audioPlayerElement.children['current-time'];
        this.positionSlider = document.getElementById('seek-slider');
        //this.duration = audioPlayerElement.children['duration'];

        // Registered using register{Stop,Pause}Callback
        this.stopCallback = null;
        this.pauseCallback = null;
        this.playCallback = null
        this.playingCallback = null

        // register event callbacks
        this.playButton.addEventListener('click', this.play);
        //this.pauseButton.addEventListener('click', this.pause);
        //this.stopButton.addEventListener('click', this.stop);
        this.audioPlayer.addEventListener('timeupdate', this.timeUpdate);
        this.audioPlayer.addEventListener('stalled', this.stalledWaitingEventHandler);
        this.audioPlayer.addEventListener('waiting', this.stalledWaitingEventHandler);
        //this.audioPlayer.addEventListener('play', this.playEventHandler);
        this.audioPlayer.addEventListener('playing', this.playingEventHandler);
        //this.audioPlayer.addEventListener('loadedmetadata', this.loadedMetaData);

    }

    /**
     * Destroy the AudioPlayer.
     * 
     * This will stop playback, set the source to null and remove all event
     * listeners. The browser should then garbage collect the player.
     */
    destroy() {
        this.pause();
        // reset the play / pause icon
        const icon = document.getElementById('play-button').children[0];
        icon.src = '/s/icons/play.png';
        //this.currentTime.innerText = "00:00";
        this.positionSlider.value = 0;
        this.playButton.removeEventListener('click', this.play);
        //this.pauseButton.removeEventListener('click', this.pause);
        //this.stopButton.removeEventListener('click', this.stop);
        this.audioPlayer.removeEventListener('timeupdate', this.timeUpdate);
        this.audioPlayer.removeEventListener('stalled', this.stalledWaitingEventHandler);
        this.audioPlayer.removeEventListener('waiting', this.stalledWaitingEventHandler);
        //this.audioPlayer.removeEventListener('play', this.playEventHandler);
        this.audioPlayer.removeEventListener('playing', this.playingEventHandler);
        //this.audioPlayer.removeEventListener('loadedmetadata', this.loadedMetaData);
        this.audioPlayer.src = null;
        this.audioPlayer = null;
        this.stopCallback = null;
        this.pauseCallback = null;
        this.playingCallback = null;
        this.playCallback = null;
    }

    /**
     * Convert seconds to a string representing duration in minutes and seconds
     * 
     * @param {Number} duration Duration in seconds
     * @return {String} Duration in MM:SS
     */
    static convertSecondsToMinutesAndSecondsString(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const returnedSeconds = seconds < 10 ? "0" + seconds : seconds;
        return `${minutes}:${returnedSeconds}`;
    }

    // EVENT HANDLERS

    /**
     * Play audio. This is also registered as a play button click event handler.
     */
     play = () => {
         const icon = document.getElementById('play-button').children[0];
         if (!this.audioPlayer.paused) {
             icon.src = '/s/icons/play.png';
             this.pause();
         } else if (this.audioPlayer.currentTime === 0) {
            icon.src = '/s/icons/pause.png';
             this.audioPlayer.play();
             if (this.playCallback) this.playCallback(this.audioPlayer);
         } else {
            icon.src = '/s/icons/pause.png';
            this.audioPlayer.play();
            if (this.playingCallback) this.playingCallback(this.audioPlayer);
         }
    }

    /**
     * Pause audio. This is also registered as a pause button click event handler. 
     */
    pause = () => {
        this.audioPlayer.pause();
        if (this.pauseCallback) this.pauseCallback();
    }

    /**
     * Stop audio. This is also registered as a stop button click event handler.
     */
    stop = () => {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        if (this.stopCallback) this.stopCallback();
    }

    /**
     * Time update event handler.
     */
     timeUpdate = () => {
        //this.currentTime.innerText = AudioPlayer.convertSecondsToMinutesAndSecondsString(this.audioPlayer.currentTime);
        this.positionSlider.value = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
    }

    /**
     * Stalled / Waiting event handler.
     * 
     * Just calls the pause callback if registered.
     */
    stalledWaitingEventHandler = () => {
        if (this.pauseCallback) this.pauseCallback();
    }

    /**
     * Play event handler.
     * 
     * Fired when play happens.
     */ 
    playEventHandler = () => {
        
    }

    /**
     * Playing event handler.
     * 
     * Fired when playback is ready to start after having been paused or delayed 
     * due to lack of data. Calls the playing callback if registered;
     */ 
    playingEventHandler = () => {
        if (this.playingCallback) this.playingCallback();
    }

    loadedMetaData = () => {
        this.duration.innerText = AudioPlayer.convertSecondsToMinutesAndSecondsString(this.audioPlayer.duration);
    }

    /**
     * Register a callback for when the player commences playing.
     * 
     * @param {Function} callback Function to register
     */
     registerPlayCallback(callback) {
        if (typeof callback === 'function') {
            this.playCallback = callback;
        } else {
            throw new Error('Function expected')
        }
    }    

    /**
     * Register a callback for when the player stops.
     * 
     * @param {Function} callback Function to register
     */
    registerStopCallback(callback) {
        if (typeof callback === 'function') {
            this.stopCallback = callback;
        } else {
            throw new Error('Function expected')
        }
    }

    /**
     * Register a callback for when the player pauses for any reason.
     * 
     * @param {Function} callback Function to register
     */
    registerPauseCallback(callback) {
        if (typeof callback === 'function') {
            this.pauseCallback = callback;
        } else {
            throw new Error('Function expected')
        }
    }

    /**
     * Register a callback for when the player resumes playing after a pause.
     * 
     * This could be called resume instead of playing, but we're matching the
     * name of the HTMLMediaElement event.
     * 
     * @param {Function} callback Function to register
     */
    registerPlayingCallback(callback) {
        if (typeof callback === 'function') {
            this.playingCallback = callback;
        } else {
            throw new Error('Function expected')
        }
    }
}

function hypotenuseDistance(side1, side2) {
    return Math.sqrt((side1 * side1) + (side2 * side2));
}

window.onload = async () => {
    animation();
    //await myMap();
    const mapElement = document.getElementById('gMap');
    const map = await MyMap.build(mapElement);
    const indexPage = await IndexPage.build(map);
};