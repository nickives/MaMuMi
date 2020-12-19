const express = require('express');
const path = require('path');

const app = express();

app.use('/s', express.static(path.resolve(__dirname, '../static')));

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'MaMuMi' });
});

module.exports = app;