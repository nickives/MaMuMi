const Point = require('../static/js/lib/point');
const Journey = require('../static/js/lib/journey');
const assert = require('assert');
const pool = require('./pool-test');
const JourneyModel = require("../models/journeys-model");
const { log } = require('console');



describe('Journeys-model.js DB Tests', function () {

    let conn, point1, point2, journey, desc;
    let model = new JourneyModel(pool);

    const truncateDB = async () => {
        // TRUNCATE all tables
        try {
            conn = await pool.getConnection();

            let sql = "SET foreign_key_checks=0"
            let res = await conn.query(sql);

            sql = "TRUNCATE `tbl_points`";
            res = await conn.query(sql);

            sql = "TRUNCATE `tbl_journeys`";
            res = await conn.query(sql);

            sql = "SET foreign_key_checks=1"; // IMPORTANT!
            res = await conn.query(sql);

        } catch (err) {
            console.log(err);
        }
    }

    beforeEach(async () => {
        await truncateDB();

        // test journey
        point1 = new Point(null, 1, {lat: 51.887491030242344, lng: -2.0881395483987832}, "http://video.link", new Date(), null);
        point2 = new Point(null, 2, {lat: 52, lng: -2}, "point2", new Date(), null);
        desc = { 
            en: "En description",
            es: "Es description",
            de: "De description",
            fr: "Fr description"
        };
        journey = new Journey("Bob", "FromTesco");
        journey.addPoint(point1);
        journey.addPoint(point2);
        point1.addDescription(desc);
        point2.addDescription(desc);
    });

    afterEach(async () => {
        await truncateDB();
        if (conn) conn.end();
    });

    after(async function () {
        await pool.end();
    });

    it('Should Create() OK', async () => {

        // Valid insert succeeds
        let res = await model.create(journey);
        assert.ok(res.affectedRows, 1);

        // Required field null fails
        journey.points[0].video_link = null;
        assert.rejects( async () => await model.create(journey), Error);
        
    });

    it('Should Read() OK!', async () => {
        let res = await model.create(journey);
        let output = await model.read(res.insertId);

        // Read OK
        assert.ok(output.forename, journey.forename);
        assert.ok(output.surname, journey.surname);

        // Make sure points are attached
        let point1Found, point2Found;
        output.points.forEach( (point) => {
            if (point.point_num === point1.point_num) {
                point1Found = true;
            } else if (point.point_num === point2.point_num) {
                point2Found = true;
            }
        })
        assert(point1Found);
        assert(point2Found);

        // make sure descriptions are also attached

        // there shouldn't be any journey with this ID in the db
        out = await model.read(999999);
        assert.ifError(out);
    });

    it('Should Update() OK!', async () => {
        let res_create = await model.create(journey);
        
        // lets change some stuff
        journey.forename = "Freddy";
        let point3 = new Point(null, 3, {lat: 52, lng: -2}, "point2", null, new Date());
        point3.addDescription( { en: "New English Description" } );
        journey.addPoint(point3);
        await model.update(res_create.insertId, journey);

        // read it back and make sure changes persisted
        let output = await model.read(res_create.insertId);

        // Make sure points are attached
        let point1Found, point2Found, point3Found;
        output.points.forEach( (point) => {
            if (point.point_num === point1.point_num) {
                point1Found = true;
            } else if (point.point_num === point2.point_num) {
                point2Found = true;
            } else if (point.point_num === point3.point_num && 
                       point.description.en === point3.description.en) {
                point3Found = true;
            }
        })

        assert.ok(output.forename === "Freddy");
        assert.ok(point1Found);
        assert.ok(point2Found);
        assert.ok(point3Found);
    });

    it('Should Delete() OK!', async () => {
        let res_create = await model.create(journey);
        let res_delete = await model.delete(res_create.insertId);

        // journey should no longer exist
        let res_read = await model.read(res_create.insertId);
        assert.ifError(res_read);
    });
})
