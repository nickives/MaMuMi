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

const Journey = require('../lib/journey');

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
    let newJourney = new Journey(journey.forename, journey.surname, journey.video_link);

    // TODO: We're not reconstructing the points here. Maybe we should be?
    if (journey.points !== undefined) {
      for (let i = 0; i < journey.points.length; i++) {
        newJourney.addPoint(journey.points[i]);
      }
    }

    newJourney.addDescription(journey.description);

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
    let res;


    // Send journey to the model to create it
    try {
      res = await this.model.create(newJourney);
    } catch (err) {
      this.view.status(422).send({message : err.message});
    }

    // Return the database response
    this.view.send("OK");
  }

  /**
   * Get a journey from the model using a given id_points
   *
   * @param {Number} id - The journey primary key
   *
   * @returns The journey or database response
   **/
  async read(id) {
    let res;

    // Read the journey from the model
    try {
      res = await this.model.read(id);
      res = JSON.stringify(res);


      // Return response
      this.view.send(res);
    } catch (err) {
      // Catch error and set status to 404
      res = JSON.stringify(err);
      this.view.sendStatus(404);
    }

    this.view.send(res);
  }

  /**
   * Fetch the first point from every journey
   *
   * @returns array of journeys or data base response
   */
  async readAll() {
    let res;
    // Read all the journeys from the model
    try {
      res = await this.model.readAll();
      res = JSON.stringify(res);


      // Return the database response to the view
      this.view.send(res);
    } catch (err) {
      res = JSON.stringify(err);
      this.view.sendStatus(500); // this operation should never fail
    }
  }

  /**
   * Update a given journey
   *
   * @param {Number} id - The journey id to update
   * @param {Journey} journey - The data to update the journey
   *
   * @returns The database response
   */
  async update(id, journey) {
    // Clone the journey to serialize
    let newJourney = await this.cloneJourney(journey);
    let res;

    // Send the id and journey to the model to update
    try {
      res = await this.model.update(id, newJourney);
      res = JSON.stringify(res);
    } catch (err) {
      res = JSON.stringify(err);
      this.view.sendStatus(422);
    }

    // Return the model response
    this.view.send("OK");
  }

  /**
   * Delete a given journey from a given id_points
   *
   * @param {Number} id - The id of the journey to delete
   *
   * @returns the database response
   */
  async delete(id) {

    if (isNaN(id)) {
      res.status(404).send("Not Found");
    }
    let res;
    try {
      let res = this.model.delete(id);
      if (res === null) {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      res = JSON.stringify(err);
      this.view.sendStatus(500); // This should never error
    }
    // Return the model response
    this.view.redirect('/admin/dashboard');
  }

  /**
   * Get the GeoJSON line for a given journey
   * 
   * @param {Number} id 
   */
  async geoJSON(id) {
    let res;
    try {
      res = await this.model.read(id);

      if (res == null) {
        this.view.sendStatus(404);
      }

      let geoJson = {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [] // [LNG, LAT]
          },
          properties: {
            journey: res
          }
        }]
      }
      res.points.map(x => {
        let num = x.point_num;
        geoJson.features[0].geometry.coordinates[num-1] = [x.loc.lng, x.loc.lat]
      });

      let json = JSON.stringify(geoJson);

      this.view.send(json);

    } catch (err) {
      this.view.sendStatus(500);
    }
  }
}

module.exports = JourneyController;
