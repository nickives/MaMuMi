const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");
const Journey = require('../lib/journey');
const Point = require('../lib/point');

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

router.use(express.json());

// Create 
router.post('/', function(req, res) {
 
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res);

  let journey = req.body;

  controller.create(journey);
});

// Read single journey
router.get('/:id', function(req, res) {

  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res);

  let id = parseInt(req.params['id']);

  controller.read(id);
});

//Read all journeys
router.get('/', function(req, res) {
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res);

  controller.readAll();
});

// Update a journey by and id
router.post('/:id/update', function(req, res) {

  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res);

  let id = parseInt(req.params['id']);
  let journey = req.body;

  controller.update(id, journey);
});

// Delete an id by an id
router.get('/:id/delete', function(req, res) {
  
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res);

  let id = parseInt(req.params['id']);

  controller.delete(id);
});


router.get('/:id/geojson', function(req, res) {
  let model = new JourneyModel(pool);
  let controller = new JourneyController(model, res);
  let id = parseInt(req.params['id']);
  controller.geoJSON(id);
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

router.get('/insert-random/:count', function(req, res) {
  const model = new JourneyModel(pool);
  const count = parseInt(req.params['count']);

  for (var i = 0; i < count; ++i) {

    const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur maximus ex ac mi sollicitudin, sit amet ullamcorper lorem egestas. Sed volutpat, velit sed commodo auctor, lacus nisi varius urna, a euismod massa ipsum semper turpis. Sed ultricies venenatis mauris, et rhoncus ipsum porta ut. Mauris eget mauris nibh. Aenean id nunc turpis. Aenean vitae sapien tempor, tincidunt odio vel, pretium mi. Aenean nec leo sed mauris elementum ultrices. Aliquam et urna nec velit posuere sollicitudin. Curabitur non diam diam. Nullam posuere nulla vel diam suscipit aliquam. Sed malesuada ligula justo, nec venenatis justo aliquet a. Aliquam erat volutpat. Cras ullamcorper quis tellus et hendrerit. Fusce vulputate lacus a dignissim egestas. Donec non diam elementum, facilisis enim quis, dignissim dolor. Cras ut semper metus, non condimentum eros.

    Mauris sit amet bibendum tortor, ac ullamcorper libero. Nunc in porta purus, ut venenatis quam. Sed iaculis vestibulum placerat. Praesent efficitur aliquam.`;

    try {
      const journey = new Journey("Person" + i, "Surname" + i, 'https://www.youtube.com/embed/0An_CT2-X08');
      const numPoints = getRandomInt(2, 5);

      journey.addDescription({
        en: "En<p>" + lorem,
        es: "Es<p>" + lorem,
        el: "El<p>" + lorem,
        bg: "Bg<p>" + lorem,
        it: "It<p>" + lorem,
        no: "No<p>" + lorem
      });

      for (var p = 0; p < numPoints; ++p) {
        const point = new Point(null, p + 1, {
          lat: getRandom(-80, 80),
          lng: getRandom(-180, 180)
        });

        journey.addPoint(point);
      }
  
      model.create(journey);

    } catch (err) {
      res.status(500).send(JSON.stringify(err));
    }
  }

  res.send("ok");
})
module.exports = router;
