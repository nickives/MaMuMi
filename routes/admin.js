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

router.get('/dashboard', async function (req, res) {
    const journeys = await new JourneyModel(pool).readAll();
    res.render('dashboard', { journeys: journeys });
});

router.get('/add-journey', function (req, res) {
    res.render('add-journey');
});

router.get('/edit-journey/:id', async function (req, res) {
    const id = Number.parseInt(req.params['id']);
    if (isNaN(id)) {
        res.status(404).send("Not Found");
    }

    const journey = await new JourneyModel(pool).read(id);
    if (journey === null) {
        res.status(404).send("Not Found");
    }

    res.render('add-journey', { journey: journey });
})

module.exports = router;
