class Journey {
    
    /**
     * A Journey has a name for the person undertaking it, and comprises an
     * array of points they visited.
     * 
     * @param {String} forename - First name of migrant
     * @param {String} surname - Surname of migrant 
     */
    constructor(forename, surname) {
        this.forename = forename;
        this.surname = surname;
        this.points = [];
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
