const express = require('express');
const path = require('path');

const app = express();

app.use('/s', express.static(path.resolve(__dirname, '../static')));
app.use('/a', express.static(path.resolve(__dirname, '../assets')));

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index');
});

/*
Information that needs to be displayed inside the
marker description box is stored in the "description" field
*/
app.get('/journeys', function(req, res, next) {
    var data = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    description: '<iframe width="420" height="345" src="https://www.youtube.com/embed/ZtNcvoG3YdQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                },
                geometry: {
                    type: "Point",
                    coordinates: [-2.088126, 51.886695]
                }
            },
            {
                type: "Feature",
                properties: {
                    description:"A description"
                },
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