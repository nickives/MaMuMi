// What needs to happen in this file:
//
// + create journey         [X]
// + return journey by id   [X]
// + return all journeys    [X]
// + update journey by id   [X]
// + delete journey by id   [X]
//
// + TEST                   [X]
//
// -Sam

const Journey = require('../static/js/lib/journey');

class JourneyController {

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  /**
   * A private function used to clone the journey data
   * that was received from outside of this class. This
   * is to serialize the data before it is entered into
   * the database.
   *
   * @param {Journey} journey - The journey object to be cloned
   *
   * @returns The cloned journey object
   */
  async cloneJourney(journey) {
    let newJourney = new Journey(journey.forename, journey.surname);
    if (journey.points !== undefined) {
      for (let i=0; i<journey.points.length; i++) {
        newJourney.addPoint(journey.points[i]);
      }
    }

    return newJourney;
  }

  /**
   * Creates a new journey in the data base by passing Journey object
   * to the model
   *
   * @param {Journey} journey - The journey object
   * 
   * @returns The database connection status
   */
  async create(journey) {
    // Clone the journey to serialize
    let newJourney = await this.cloneJourney(journey);
    

    // Send journey to the model to create it
    try {
      let res = await this.model.create(newJourney);
      res = JSON.stringify(res);
    } catch(err) {
      res = JSON.stringify(res); 
      this.view.status(422);
    }

    // Return the database response
    this.view.send(res);
  }

  /**
   * Get a journey from the model using a given id_points
   *
   * @param {int} id - The journey primary key
   *
   * @returns The journey or database response
   **/
  async read(id) {
    // Read the journey from the model
    try {
      let res = await this.model.read(id);
      res = JSON.stringify(res);
    catch (err) {
      // Catch error and set status to 404
      res = JSON.stringify(err);
      this.view.status(404);
    }

    // Return response
    this.view.send(res);
  }

  /**
   * Fetch the first point from every journey
   *
   * @returns array of journeys or data base response
   */
  async readAll() {
    // Read all the journeys from the model
    try {
      let res = await this.model.readAll();
      res = JSON.stringify(res);
    catch (err) {
      res = JSON.stringify(err);
      this.view.status(404);
    }

    // Return the database response to the view
    this.view.send(res);
  }

  /**
   * Update a given journey
   *
   * @param {int} id - The journey id to update
   * @param {Journey} journey - The data to update the journey
   *
   * @returns The database response
   */
  async update(id, journey) {
    // Clone the journey to serialize
    let newJourney = await this.cloneJourney(journey);

    // Send the id and journey to the model to update
    try {
      let res = await this.model.update(id, newJourney);
      res = JSON.stringify(res);
    } catch (err) {
      res = JSON.stringify(err);
      this.view.status(422);
    }

    // Return the model response
    this.view.send(res);
  }

  /**
   * Delete a given journey from a given id_points
   *
   * @param {int} id - The id of the journey to delete
   *
   * @returns the database response
   */
  async delete(id) {
    try {
      let res = this.model.delete(id);
      res = JSON.stringify(res);
    } catch (err) { 
      res = JSON.stringify(err);
      this.view.status(404);
    }
    // Return the model response
    this.view.send(res);
  }
}

module.exports = JourneyController;
