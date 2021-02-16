const express = require('express');
const router = express.Router();

/* GET landing page. */
router.get('/', function(req, res, next) {
    res.render('lang');
});

module.exports = router;