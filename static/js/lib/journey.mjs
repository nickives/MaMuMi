export class Journey {
    
    /**
     * A Journey has a name for the person undertaking it, and comprises an
     * array of points they visited.
     * 
     * @param {String} name - Name of journey
     * @param {String} subtitle - Journey subtitle
     * @param {Number} id - Primary key of journey, positive integer
     * @param {String} audio_uri - link to media
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
