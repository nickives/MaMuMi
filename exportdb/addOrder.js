const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('./db.json');

(async function () {
    const db = await low(adapter);
    await db.defaults({ journeys: [], sessions: [] });
    const journeys = await db.get('journeys').value();

    for (let j of journeys) {
        const nameSplit = j.name_en.split(' ');
        const storyNumber = nameSplit[nameSplit.length - 1];
        j.order = parseInt(storyNumber);
    }
    await db.write();
    process.exit();
})()
