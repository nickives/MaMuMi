const express = require('express');
const router = express.Router();

// Require Model and controller
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync(__dirname + '/../db/db.json');

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

router.use(express.json());

// Read single journey
router.get('/:id', async function(req, res) {

  // Create model object
  const db = await low(adapter);
  let model = new JourneyModel(db);

  // Create controller object
  let controller = new JourneyController(model, res);

  let id = parseInt(req.params['id']);

  controller.read(id);
});

//Read all journeys
router.get('/', async function(req, res) {
  // Create model object
  const db = await low(adapter);
  let model = new JourneyModel(db);

  // Create controller object
  let controller = new JourneyController(model, res);

  controller.readAll();
});
module.exports = router;
