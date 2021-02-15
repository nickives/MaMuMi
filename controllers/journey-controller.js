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

  async create(journey) {
    // Clone the journey to serialize
    var newJourney = new Journey(journey.forename, journey.surname);
    for (let i=0; i<journey.points.length; i++) {
      newJourney.addPoint(journey.points[i]);
    }

    // Send journey to the model to create it
    let res = await this.model.create(newJourney);
    
    // Return the database response
    this.view(res);
  }
}

module.exports = JourneyController;
