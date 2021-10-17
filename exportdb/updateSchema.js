const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('./db.json');

(async function () {
    const db = await low(adapter);
    await db.defaults({ journeys: [], sessions: [] });
    const journeys = await db.get('journeys').value();
    for (let j of journeys) {
        j.name = {
            en: j.name_en,
            el: '',
            es: '',
            bg: '',
            no: '',
            it: '',
        }
        j.name_en = undefined;

        j.subtitle = {
            en: j.subtitle_en,
            el: '',
            es: '',
            bg: '',
            no: '',
            it: '',
        }
        j.subtitle_en = undefined;
    }
    await db.write();
    process.exit();
})()