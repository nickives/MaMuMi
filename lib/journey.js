class Journey {
    
    /**
     * @typedef JourneyName
     * @type {object}
     * @property {string} en - English name
     * @property {string} el - Greek name
     * @property {string} es - Spanish name
     * @property {string} bg - Bulgarian name
     * @property {string} no - Norweigen name
     * @property {string} it - Italian name
     */

    /**
     * @typedef JourneySubtitle
     * @type {object}
     * @property {string} en - English subtitle
     * @property {string} el - Greek subtitle
     * @property {string} es - Spanish subtitle
     * @property {string} bg - Bulgarian subtitle
     * @property {string} no - Norweigen subtitle
     * @property {string} it - Italian subtitle
     */

    /**
     * A Journey has a name for the person undertaking it, and comprises an
     * array of points they visited.
     * 
     * @param {JourneyName} name - Names of journey
     * @param {JourneySubtitle} subtitle - Journey subtitles
     * @param {String} audio_uri - link to media
     * @param {number} id - Primary key of journey, positive integer. Optional
     */
    constructor(name, subtitle, audio_uri, id) {
        this.name = name;
        this.subtitle = subtitle;
        this.audio_uri = audio_uri;
        this.points = [];
        this.id = id;
        this.description = {};       
    }

    /**
     * Add descriptions. This should be an object with two letter language keys
     * and associated descriptions.
     * 
     * @param {*} description 
     */
     addDescription(description) {
        this.description = {...this.description, ...description};
    }

    /**
     * Remove description. This should be a two letter locale such as 'en'.
     * 
     * @param {String} locale 
     */
     removeDescription(locale) {
        delete this.description[locale];
    }

    /**
     * Add a point to the journey. This method will not add a point if that point_num already exists for this journey!
     * 
     * @param {Point} point - The point to add
     */
    addPoint(point) {
        const pos = this.points.find(e => e.point_num === point.point_num);

        if (pos === undefined) {
            this.points.push(point);
        }
    }

    /**
     * Removes the point provided. This compares against point_num.
     * 
     * 
     * @param {Point} point - the point to remove
     */
    removePoint(point) {
        const pos = this.points.find(e => e.point_num === point.point_num);

        if (pos !== undefined) {
            this.points.splice(pos, 1);
        }
    }
}

module.exports = Journey;
