const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const JourneyModel = require("../models/journeys-model");
const pool = require('./pool')

const adapter = new FileAsync('./db.json');

(async function () {
    const db = await low(adapter);
    await db.set('journeys', []).write();
    await db.set('sessions', []).write();
    await db.defaults({ journeys: [], sessions: [] });
    const model = new JourneyModel(pool);
    const journeys = await model.readAll();

    for (let j of journeys) {
        await db.get('journeys')
            .push(j)
            .write()
            .then(() => console.log('saved'));
    }
    process.exit();
})()
