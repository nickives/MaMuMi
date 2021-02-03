const pool = require('../lib/db/pool-secret');

module.exports = {

    /**
     * Create new Journey record
     * 
     * @param {Journey} journey - the journey to insert
     * 
     * @returns status of connection
     * @throws database errors
     */
    async create(journey) {
        let conn;

        try {
            const conn = await pool.getConnection();
            sql = "INSERT INTO `journeys` (forename, surname) VALUES (?, ?)";
            const res = await conn.query(sql, journey.forename, journey.surname);
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
            return res;
        }
    },

    /**
     * Read a Journey
     * 
     * @param {int} id - Primary key
     * 
     * @returns {Journey} - Journey identified by primary key
     * @throws database errors
     */
    async read(id) {
        const conn = await pool.getConnection();


    },

    /**
     * Update a Journey
     * 
     * @param {int} id - Primary key
     * 
     * @returns status of connection
     * @throws database errors
     */
    async update(id) {

    },

    /**
     * Delete a Journey
     * 
     * @param {int} id - Primary key
     * 
     * @returns status of connection
     * @throws database errors
     */
    async delete(id) {

    }
}