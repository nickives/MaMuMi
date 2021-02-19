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
    res.render('admin');
});

module.exports = router;
