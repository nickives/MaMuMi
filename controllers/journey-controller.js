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
const Point = require('../lib/point');

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
   * @throws Error if journey does not meet expectations. This includes missing
   * fields, ID's that aren't numbers and a journey without points.
   */
  cloneJourney(journey) {
    const name = {};
    const subtitle = {};

    if (journey.name) {
      for (const [key, value] of Object.entries(journey.name)) {
        switch (key) {
          case 'bg':
          case 'el':
          case 'en':
          case 'es':
          case 'it':
          case 'no':
            if (typeof value === 'string') {
              name[key] = value;
            } else {
              throw new TypeError('Invalid Name');
            }
            break;
          default:
            throw new TypeError('Unexpected Language Key');
        }
      }
    }

    if (journey.subtitle) {
      for (const [key, value] of Object.entries(journey.subtitle)) {
        switch (key) {
          case 'bg':
          case 'el':
          case 'en':
          case 'es':
          case 'it':
          case 'no':
            if (typeof value === 'string') {
              subtitle[key] = value;
            } else {
              throw new TypeError('Invalid Subtitle');
            }
            break;
          default:
            throw new TypeError('Unexpected Language Key');
        }
      }
    }

    if (journey.audio_uri) {
      if (typeof journey.audio_uri != 'string') {
        throw new TypeError('Invalid audio URI');
      }
    }

    let newJourney = new Journey(name, subtitle, journey.audio_uri);
    const order = parseInt(journey.order);
    if (typeof order != 'number' || isNaN(order)) {
      throw new TypeError('Invalid Journey Order');
    }
    newJourney.order = parseInt(journey.order);

    // validate id - will happen in case of update
    if (journey.id) {
      if (typeof journey.id != 'number') {
        throw new TypeError('Invalid Journey ID');
      }
      newJourney.id = journey.id;
    }


    // A journey will always have points, so don't bother to check if they exist
    for (let i = 0; i < journey.points.length; i++) {
      const point_num = journey.points[i].point_num;
      const lat = journey.points[i].loc.lat;
      const lng = journey.points[i].loc.lng;

      if ((typeof point_num != 'number') || (typeof lat != 'number') 
          || (typeof lng != 'number')) {
            throw new TypeError('Invalid Point');
      }
      const loc = { lat: lat, lng: lng };
      const point = new Point(undefined, point_num, loc);
      newJourney.addPoint(point);
    }

    if (journey.description) {
      for (const [key, value] of Object.entries(journey.description)) {
        switch (key) {
          case 'bg':
          case 'el':
          case 'en':
          case 'es':
          case 'it':
          case 'no':
            if (typeof value === 'string') {
              const cleanedValue = value.replace(/\n/g, '<BR>');
              newJourney.addDescription( { [key]: cleanedValue } );
            }
            break;
          default:
            throw new TypeError('Unexpected Language Key');
        }
      }
    }

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
  create(req) {

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
      await fs.copyFile(originalPath, newPath);
      await fs.unlink(originalPath);
      // Just store the file path, not the full URI. It means everything won't 
      // break if the hostname changes (this was a real problem).
      const audio_uri = '/s/audio/' + filename;

      const inputJourney = JSON.parse(fields.journey);

      let res;
      try {
        const newJourney = this.cloneJourney(inputJourney);
        newJourney.audio_uri = audio_uri;
        res = await this.model.create(newJourney);
        this.view.redirect("/admin/dashboard");

      } catch (err) {
        console.log(err);

        // delete from /static/audio
        fs.stat(newPath)
        .then(() => fs.unlink(newPath))
        .catch((err) => {
          // we expect ENOENT - no such file
          if (err.errno !== -2) console.log(err);
        });
        // delete from /uploads
        fs.stat(originalPath)
        .then(() => fs.unlink(originalPath))
        .catch((err) => {
          if (err.errno !== -2) console.log(err);
        });

        // cloneJourney throws TypeError
        if (err.name === 'TypeError') {
          this.view.sendStatus(400);
        } else {
          this.view.sendStatus(500);
        }
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
      


      // Return response
      if (res == null) {
        createError(404);
      } else {
        res = JSON.stringify(res);
        this.view.send(res);
      }
      
    } catch (err) {
      // Catch error and set status to 404
      res = JSON.stringify(err);
      this.view.sendStatus(404);
    }
  }

  /**
   * Fetch the first point from every journey
   *
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
   * @param {Request} req - The request object
   */
  async update(req) {

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
      const inputJourney = JSON.parse(fields.journey);

      let res;
      let newPath = '';
      let originalPath = '';
      try {
        const id = parseInt(req.params['id']);
        const newJourney = this.cloneJourney(inputJourney);
        newJourney.id = id;

        // if we got a new file, attach new uri here
        let filename;
        if (file['audio_file']) {
          // move file from /uploads to /static/audio
          originalPath = file['audio_file'].path;
          filename = path.parse(file['audio_file'].path).base;
          newPath = `${__dirname}/../static/audio/${filename}`;
            await fs.copyFile(originalPath, newPath);
          await fs.unlink(originalPath);
          // Just store the file path, not the full URI. It means everything won't 
          // break if the hostname changes (this was a real problem).
          const audio_uri = '/s/audio/' + filename;
          newJourney.audio_uri = audio_uri;
        }
        
        // if a new file was uploaded, get path of old file and delete.
        const oldAudioUri = await ( async () => {
          if (file['audio_file']) {
            const oldJourney = await this.model.read(id);
            return oldJourney.audio_uri;
          }
        })();


        // make sure we can create OK
        res = await this.model.update(id, newJourney);
        this.view.send("OK");

        // now delete old file
        if (oldAudioUri) {
          const pathArray = oldAudioUri.split('/');
          const fileName = pathArray[pathArray.length - 1];
          try {
            fs.unlink(`${__dirname}/../static/audio/${fileName}`);
          } catch {
            // Don't crash if file doesn't exist, throw otherwise
            if (err.errno !== -2) throw new Error('Error deleting file');
          }
        }
      } catch (err) {
        console.log(err);

        // delete from /static/audio
        if (newPath !== '') {
          fs.stat(newPath)
          .then(() => fs.unlink(newPath))
          .catch((err) => console.log(err));
        }
        

        // delete from /uploads
        if (originalPath !== '') {
          fs.stat(originalPath)
          .then(() => fs.unlink(originalPath))
          .catch((err) => console.log(err));
        }        

        // cloneJourney throws TypeError
        if (err.name === 'TypeError') {
          this.view.sendStatus(400);
        } else {
          this.view.sendStatus(500);
        }
      }
    });
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
      let result = await this.model.delete(id);

      if (result) {
        const uriParts = result.audio_uri.split('/');
        const fileName = uriParts[uriParts.length - 1]; // last element
        const filePath = `${__dirname}/../static/audio/${fileName}`;
        try {
          await fs.unlink(filePath);
        } catch (err) {
          // Don't crash if file doesn't exist, throw otherwise
          if (err.errno !== -2) throw new Error('Error deleting file');
        }
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
