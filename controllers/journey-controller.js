// What needs to happen in this file:
//
// + Add locales            []
// + create journey         [X]
// + return all journeys    []
// + return journey by id   []
// + update journey by id   []
// + delete journey by id   []
// -Sam

const pool = require('../lib/db/pool-secret-template.js');
const JourneyModel = require("../models/journeys-model");
const model = new JourneyModel(pool);

const Journey = require('../static/js/lib/journey');

/**
 * i18n is being funky so I am commenting it out till it behaves

// i18n provides locales
const I18n = require('i18n');
const i18n = new I18n();
const path = require('path');

i18n.configure({
  locales: ['en', 'de'],
  directory: path.join(__direname, '../locales')
})
*/

/**
 * Creates a new journey record
 * 
 * @param {*} req - The request 
 * @returns database response
 */
const journey_create = (req, res) => {
    let journey = new Journey(req.forename, req.surname);
    let dbResponse = model.create(req);
    
    res.send(dbResponse);
}

/**
 * Fetches a journey from the database from a given id
 * 
 * @param {int} req - Journey id
 * @param {*} res - The database response
 */
const journey_get = (req, res) => {
  var journey_id = req.body.journey_id;
  
  try {
    var journey = JourneyModel.read(journey_id);
    res.send(journey);
  } catch (err) {
    res.send(err);
  } 
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
