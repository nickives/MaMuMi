const Journey = require("../lib/journey");

class JourneyModel {

    /**
     * Get a Journey Model.
     * 
     * @param {lowdb} db Lowdb instance 
     */
    constructor(db) {
        db.defaults({ journeys: [], journeysIndex: 0 });
        this.db = db;
    }

    /**
     * Create new Journey record
     * 
     * @param {Journey} journey - the journey to insert
     * 
     * @returns status of connection
     * @throws database errors
     */
    async create(journey) {
        let id = await this.db.get('journeysIndex').value();
        journey.id = id;
        ++id;

        return await this.db.get('journeys')
            .push(journey)
            .write();
    }

    /**
     * Read a Journey
     * 
     * @param {Number} id - Primary key, must be positive integer
     * 
     * @returns {Journey} - Journey object, or null if nothing found
     */
    async read(id) {
        let journey = null;
        journey = await this.db
            .get('journeys')
            .find({ id: id })
            .value();

        return journey;
    }

    /**
     * Update a Journey. 
     * 
     * @param {int} id - Primary key
     * @param {Journey} journey - Journey to update
     */
    async update(id, journey) {
        const res = await this.db
            .get('journeys')
            .find({ id: id })
            .assign(journey)
            .write();

        return res;
    }

    /**
     * Delete a Journey
     * 
     * @param {int} id - Primary key
     * 
     * @returns status of connection
     * @throws database errors
     */
    async delete(id) {
        const res = await this.db
            .get('journeys')
            .remove({ id: id })
            .write();

        return res;
    }


    /**
     * Read all journeys. This will return all journeys, but each journey will 
     * only have the first point attached, or no points if non exist.
     * 
     * @return {[Journey]} Array of Journeys
     */
    async readAll() {
        let journeys = await this.db.get('journeys').value();
        journeys = (journeys) ? journeys : {};
        return journeys;
    }
}

module.exports = JourneyModel;
