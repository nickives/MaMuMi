const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const SessionModel = require('../models/session-model');
const pool = require("../lib/db/pool");
const formidable = require('formidable');
const CryptoJS = require('crypto-js');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let isLoggedIn = false;
    if (req.cookies && req.cookies.sessionKey) {
        const sessionKey = req.cookies.sessionKey;
        const model = new SessionModel(pool);
        isLoggedIn = await model.isSessionIdValid(sessionKey);
    }

    if (isLoggedIn) {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
    
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', async function (req, res, next) {

    try {
        const expectedPasscodeHash = process.env.APP_ADMIN_PASS_SHA256;
        const passcodeHash = CryptoJS.SHA256(req.body.password).toString();

        if (passcodeHash === expectedPasscodeHash) {
            const model = new SessionModel(pool);
            const sessionKey = await model.create();
            res.cookie('sessionKey', sessionKey);
            res.redirect('/admin/dashboard');
        } else {
            res.status(403).render('login', { badPassword: true } );
        }
    } catch {
        res.sendStatus(500);
    }
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
