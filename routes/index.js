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
                properties: {
                    midpoint: [0, 51.9]
                },
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [7.088126, 51.886695],
                        [0, 51.9],
                        [-3.2, 52.5]
                    ]
                }
            }
        ]
    };

    res.send(JSON.stringify(data))
})

module.exports = app;