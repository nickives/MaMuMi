const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const JourneyModel = require("../models/journeys-model");
const pool = require('./pool')

const adapter = new FileAsync('./db.json');

(async function () {
    const db = await low(adapter);
    await db.defaults({ journeys: [], sessions: [] });
    const model = new JourneyModel(pool);
    const journeys = await db.get('journeys').value();

    for (let j of journeys) {
        const oldJourney = await model.read(j.id);
        j.points = oldJourney.points;
        for (let p of j.points) {
            p.id_journeys = undefined;
            p.id_points = undefined;
        }
    }
    await db.write();
    process.exit();
})()
