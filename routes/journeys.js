const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");
const Journey = require('../static/js/lib/journey');
const Point = require('../static/js/lib/point');

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
router.post('/:id/delete', function(req, res) {
  
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
  let model = new JourneyModel(pool);
  let count = parseInt(req.params['count']);

  for (var i = 0; i < count; ++i) {

    try {
      let journey = new Journey("Person" + i, "Surname" + i);
      let numPoints = getRandomInt(2, 5);

      for (var p = 0; p < numPoints; ++p) {
        let point = new Point(null, p + 1, {
          lat: getRandom(-80, 80),
          lng: getRandom(-180, 180)
        },
        'https://www.youtube.com/embed/0An_CT2-X08',
        new Date(), new Date());
        point.addDescription({
          en: "En" + p,
          es: "Es" + p,
          el: "El" + p,
          bg: "Bg" + p,
          it: "It" + p,
          no: "No" + p

        })
        journey.addPoint(point);
      }
  
      model.create(journey);

    } catch (err) {
      res.status(500).send('JSON.stringify(err)');
    }
  }

  res.send("ok");
})
module.exports = router;
