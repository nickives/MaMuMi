// What needs to happen in this file:
//
// + create journey         []
// + return all journeys    []
// + return journey by id   []
// + update journey by id   []
// + delete journey by id   []
// -Sam

const journeysModel = require("../models/journeys-model")

/**
 * Creates a new journey record
 * 
 * @param {*} req - The request 
 * @param {*} res - database response
 */
const journey_create = (req, res) => {
    var journey = req.body;
    res.send(journeysModel.create(journey));
}

/**
 * Fetches a journey from the database from a given id
 * 
 * @param {int} req - Journey id
 * @param {*} res - The database response
 */
const journey_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

/**
 * Returns all the journeys from the database
 * 
 * @param {*} req
 * @param {*} res - Every journey
 */
const journey_get_all = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const journey_update = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const journey_delete = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

module.exports = {
    journey_create,
    journey_get,
    journey_get_all,
    journey_update,
    journey_delete
}