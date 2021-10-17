const express = require('express');
const router = express.Router();
const JourneyModel = require('../models/journeys-model');
const JourneyController = require("../controllers/journey-controller");
const SessionModel = require('../models/session-model');
const CryptoJS = require('crypto-js');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync(__dirname + '/../db/db.json');
router.use(express.json());

/**
 * Authentication middleware
 */
router.use(async (req, res, next) => {
    let isLoggedIn = false;
    if (req.cookies && req.cookies.sessionKey) {
        const sessionKey = parseInt(req.cookies.sessionKey);
        const db = await low(adapter);
        const model = new SessionModel(db);
        const result = await model.read(sessionKey);
        // if we get a matching session key
        if (result) {
            const timeLimit = 1200000 // 20 minutes;
            const timeThreshold = Date.now().valueOf() - timeLimit;
            const lastAccessTime = result.lastAccess;
            isLoggedIn = lastAccessTime > timeThreshold;
            if (isLoggedIn) model.update(sessionKey);
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
            const db = await low(adapter);
            const model = new SessionModel(db);
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
    const db = await low(adapter);
    const journeys = await new JourneyModel(db).readAll();
    journeys.sort( (e1, e2) => { return e1.order - e2.order });
    res.render('dashboard', { journeys: journeys, lang: res.locale });
});

router.get('/add-journey', function (req, res) {
    res.render('add-journey');
});

router.get('/edit-journey/:id', async function (req, res) {
    const id = Number.parseInt(req.params['id']);
    if (isNaN(id)) {
        res.status(404).send("Not Found");
    }
    const db = await low(adapter);
    const journey = await new JourneyModel(db).read(id);
    if (journey === null) {
        res.status(404).send("Not Found");
    }

    res.render('add-journey', { journey: journey });
});

// Create 
router.post('/journey/create', async function(req, res, next) {
 
    // Create model object
    const db = await low(adapter);
    const model = new JourneyModel(db);
  
    // Create controller object
    let controller = new JourneyController(model, res);
  
    controller.create(req);
});

// Update a journey by and id
router.post('/journey/:id/update', async function(req, res) {

    // Create model object
    const db = await low(adapter);
    const model = new JourneyModel(db);
  
    // Create controller object
    let controller = new JourneyController(model, res);
    controller.update(req);
});

// Delete an id by an id
router.get('/journey/:id/delete', async function(req, res) {
  
    // Create model object
    const db = await low(adapter);
    const model = new JourneyModel(db);
  
    // Create controller object
    let controller = new JourneyController(model, res);
  
    let id = parseInt(req.params['id']);
  
    controller.delete(id);
});

module.exports = router;
