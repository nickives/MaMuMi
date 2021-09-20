const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const pool = require("../lib/db/pool");

/* GET home page. */
router.get('/', async function(req, res, next) {
    const journeys = await new JourneyModel(pool).readAll();
    res.render('index', { journeys: journeys });
});

module.exports = router;