const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");

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

module.exports = router;
