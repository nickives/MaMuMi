const express = require('express');
const router = express.Router();

// Create model object
const pool = require("../lib/db/pool-secret");
const JourneyModel = require("../models/journeys-model");
let model = new JourneyModel(pool);

// Create controller object
const JourneyController = require("../controllers/journey-controller");
let controller = new JourneyController(model, res.send);

// BIG NOTE REMEMBER - ALL PATHS IN THIS FILE ALREADY HAVE /journeys PREPENDED AT THE START

// Create 
router.post('/', function(req, res) {
  controller.create(req);
});

// Read single journey
router.get('/:id', function(req, res) {
  let id = parseInt(req.params['id']);
  controller.read(id);
}

//Read all journeys
router.get('/', function(req, res) {
  controller.readAll();
}

// Update a journey by and id
router.post('/:id/update/:journey', function(req, res) {
  let id = parseInt(req.params['id']);
  let journey = req.params['journey'];
  controller.update(id, journey);
}

// Delete an id by an id
router.post('/:id/delete', function(req, res) {
  let id = parseInt(req.params['id']);
  controller.delete(id);
}


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
