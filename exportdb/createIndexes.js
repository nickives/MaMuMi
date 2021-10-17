const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('./db.json');

(async function () {
    const db = await low(adapter);
    await db.defaults({ journeys: [], journeysIndex: 0, sessions: [] });
    const journeys = await db.get('journeys').value();

    let i = 0;
    for (let j of journeys) {
        j.id = i;
        ++i;
    }
    await db.set('journeysIndex', i).write();
    process.exit();
})()
