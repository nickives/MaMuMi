const assert = require('assert');
const pool = require('./pool-test');
const SessionModel = require("../models/session-model");
const { log } = require('console');

describe('Session-model.js DB tests', function () {

    let conn;
    let model = new SessionModel(pool);

    const truncateDB = async () => {
        // TRUNCATE all tables
        try {
            conn = await pool.getConnection();

            let sql = "SET foreign_key_checks=0"
            let res = await conn.query(sql);
            
            sql = "TRUNCATE `tbl_sessions`";
            res = await conn.query(sql);

            sql = "SET foreign_key_checks=1"; // IMPORTANT!
            res = await conn.query(sql);

        } catch (err) {
            console.log(err);
        }
    }

    beforeEach(async () => {
        await truncateDB();
    });

    it('Should login() OK', async () => {
        let res = await model.insert();
        let res2 =  await model.insert();
        let res3 = 3;
    });
});