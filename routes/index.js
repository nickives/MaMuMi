const express = require('express');
const path = require('path');

const app = express();

app.use('/s', express.static(path.resolve(__dirname, '../static')));

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/journeys', function(req, res, next) {
    var data = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [-2.088126, 51.886695]
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [-2.2, 55,]
                }
            }
        ]
    };

    res.send(JSON.stringify(data))
})

module.exports = app;