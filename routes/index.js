const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync(__dirname + '/../db/db.json');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const db = await low(adapter);
        const journeys = await new JourneyModel(db).readAll();
        const lang = res.locale;
        journeys.sort( (e1, e2) => { return e1.order - e2.order });
        res.render('index', { journeys: journeys, lang: lang });
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
    
});

module.exports = router;