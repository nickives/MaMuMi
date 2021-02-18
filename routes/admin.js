const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/admin/login');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard');
});

router.get('/all-journies', function(req, res, next) {
    res.render('all-journies');
});

router.get('/create-journey', function(req, res, next) {
    res.render('create-journey');
});

router.get('/update-journey', function(req, res, next) {
    res.render('update-journey');
});

router.get('/delete-journey', function(req, res, next) {
    res.render('delete-journey');
});

module.exports = router;