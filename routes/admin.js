const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const pool = require("../lib/db/pool-secret");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/admin/login');
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/dashboard', async function (req, res, next) {
    const journeys = await new JourneyModel(pool).readAll();
    res.render('dashboard', { journeys: journeys });
});

router.get('/add-journey', function (req, res, next) {
    res.render('add-journey');
});


module.exports = router;
