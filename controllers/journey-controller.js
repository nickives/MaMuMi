// What needs to happen in this file:
//
// + Add locales            []
// + create journey         [X]
// + return all journeys    []
// + return journey by id   []
// + update journey by id   []
// + delete journey by id   []
// -Sam

const Journey = require('../static/js/lib/journey');

class JourneyController {

  constructor(model, view) {
    this.model = model;
    this.view = view;
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
    let newJourney = new Journey(journey.forename, journey.surname);
    for (let i=0; i<journey.points.length; i++) {
      newJourney.addPoint(journey.points[i]);
    }

    // Send journey to the model to create it
    let res = await this.model.create(newJourney);
    
    // Return the database response
    this.view(res);
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
    let res = await this.model.read(id);

    // Return the database response to the view
    this.view(res);
  }

}

module.exports = JourneyController;
