const express = require('express');
const router = express.Router();

// Require Model and controller
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

// Create 
router.post('/', function(req, res) {
<<<<<<< HEAD
  const journey = JSON.deserialize(req.body);
  const controller = new JourneyController(model, res.send);
=======
  
  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

  let journey = JSON.deserialize(req.body);
>>>>>>> 652854cd5cd831b2862651cf734b2581807c7ab6
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
<<<<<<< HEAD
  const controller = new JourneyController(model, res.send);
=======

  // Create model object
  let model = new JourneyModel(pool);

  // Create controller object
  let controller = new JourneyController(model, res.send);

>>>>>>> 652854cd5cd831b2862651cf734b2581807c7ab6
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


/**
 * DUMMY DATA 
 * 
 * Information that needs to be displayed inside the
 * marker description box is stored in the "description" field
router.get('/', function(req, res, next) {

    var data = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    description: "Journey Start"
                },
                geometry: {
                    type: "Point",
                    coordinates: [7.088126, 51.886695]
                }
            },
            {
                type: "Feature",
                properties: {
                    description: "Journey End"
                },
                geometry: {
                    type: "Point",
                    coordinates: [-3.2, 52.5]
                },
            },
            {
                type: "Feature",
                properties: {
                    description: '<iframe width="420" height="345" src="https://www.youtube.com/embed/ZtNcvoG3YdQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    midpoint: [0, 51.9]
                },
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [7.088126, 51.886695],
                        [0, 51.9],
                        [-3.2, 52.5]
                    ]
                }
            }
        ]
    };

    res.send(JSON.stringify(data))

})
*/
module.exports = router;
