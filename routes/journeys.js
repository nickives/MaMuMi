const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");
const Journey = require('../lib/journey');
const Point = require('../lib/point');

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

router.use(express.json());

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
module.exports = router;
