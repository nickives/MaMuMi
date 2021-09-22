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
const formidable = require('formidable');
const fs = require('fs').promises;
const path = require('path');

class JourneyController {

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  /**
   * A private function used to clone the journey data
   * that was received from outside of this class. This
   * is to santise the object before it is entered into
   * the database.
   *
   * @param {Journey} journey - The journey object to be cloned
   *
   * @returns The cloned journey object
   */
  cloneJourney(journey) {
    let newJourney = new Journey(journey.forename, journey.surname, journey.audio_uri);

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
   * @param {Journey} req - The request object
   * 
   * @returns The database connection status
   */
  async create(req) {

    const form = formidable({ 
      keepExtensions: true,
      multiples: true,
      uploadDir: `${__dirname}/../uploads`
    });

    form.parse(req, async (err, fields, file) => {
      if (err) {
        //next(err);
        return;
      }

      // move file from /uploads to /static/audio
      const originalPath = file['audio_file'].path;
      const filename = path.parse(file['audio_file'].path).base;
      const newPath = `${__dirname}/../static/audio/${filename}`;
      await fs.rename(originalPath, newPath);
      const audio_uri = `${this.view.locals.hostname}/s/audio/${filename}`;

      const inputJourney = JSON.parse(fields.journey);

      const newJourney = new Journey(inputJourney.name, inputJourney.subtitle, audio_uri);

      if (inputJourney.points !== undefined) {
        for (let i = 0; i < inputJourney.points.length; i++) {
          newJourney.addPoint(inputJourney.points[i]);
        }
      }
  
      newJourney.addDescription(inputJourney.description);

      let res;
      try {
        res = await this.model.create(newJourney);
        this.view.send("OK");

      } catch (err) {
        fs.stat(newPath)
        .then(() => fs.unlink(newPath))
        .catch();

        fs.stat(originalPath)
        .then(() => fs.unlink(originalPath))
        .catch();

        this.view.status(422).send({message : err.message});
      }
    });
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

    //this.view.send(res);
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
    let newJourney = this.cloneJourney(journey);
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
   * Delete a journey by id
   *
   * @param {Number} id - The id of the journey to delete
   *
   * @returns the database response
   */
  async delete(id) {

    if (isNaN(id)) {
      res.status(404).send("Not Found");
    }
    try {
      let result = await this.model.read(id);

      //let result = 
      if (result !== null) {
        await this.model.delete(id);
        const uriParts = result.audio_uri.split('/');
        const fileName = uriParts[uriParts.length - 1]; // last element
        const filePath = `${__dirname}/../static/audio/${fileName}`;
        await fs.unlink(filePath);
        this.view.redirect('/admin/dashboard');
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      this.view.sendStatus(500); // This should never error
    }
  }
}

module.exports = JourneyController;
