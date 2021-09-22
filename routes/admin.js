const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const SessionModel = require('../models/session-model');
const pool = require("../lib/db/pool");
const formidable = require('formidable');
const CryptoJS = require('crypto-js');


/**
 * Authentication middleware
 */
router.use(async (req, res, next) => {
    let isLoggedIn = false;
    if (req.cookies && req.cookies.sessionKey) {
        const sessionKey = req.cookies.sessionKey;
        const model = new SessionModel(pool);
        const result = await model.read(sessionKey);
        // if we get a matching session key
        if (result[0]) {
            const timeLimit = 1200000 // 20 minutes;
            const timeThreshold = Date.now().valueOf() - timeLimit;
            const lastAccessTime = result[0].last_access.valueOf();
            isLoggedIn = lastAccessTime > timeThreshold;
        }
    }

    if (isLoggedIn) {
        req.isLoggedIn = true;
        next();
    } else if (req.path === '/login') {
        // if they were trying to login anyway
        next();
    } else {
        res.redirect('/admin/login');
    }
})

/* GET home page. */
router.get('/', async function (req, res, next) {
    res.redirect('/admin/dashboard');
});

router.get('/logout', function (req, res, next) {
    res.clearCookie('sessionKey');
    res.redirect('/admin/login');
})

router.get('/login', function (req, res, next) {
    if (req.isLoggedIn) {
        // set in authentication middleware. Stops user logging in twice.
        res.redirect('/admin/dashboard');
    } else {
        res.render('login');
    }
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
