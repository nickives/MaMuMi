const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

// Create 
router.post('/', function(req, res) {
 
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  let journey = JSON.deserialize(req.body);

  controller.create(journey);
});

// Read single journey
router.get('/:id', function(req, res) {

  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  let id = parseInt(req.params['id']);
  const controller = new JourneyController(model, res.send);
  controller.read(id);
});

//Read all journeys
router.get('/', function(req, res) {
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  controller.readAll();
});

// Update a journey by and id
router.post('/:id/update', function(req, res) {

  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  let id = parseInt(req.params['id']);
  let journey = JSON.deserialize(req.body);
  const controller = new JourneyController(model, res.send);
  controller.update(id, journey);
});

// Delete an id by an id
router.post('/:id/delete', function(req, res) {
  
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  let id = parseInt(req.params['id']);
  const controller = new JourneyController(model, res.send);
  controller.delete(id);
});

module.exports = router;
