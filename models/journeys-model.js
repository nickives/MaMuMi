const Journey = require("../static/js/lib/journey");
const Point = require("../static/js/lib/point");

class JourneyModel {

    /**
     * Get a Journey Model. This constructor requires a connection pool.
     * 
     * @param {mariadb.Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Insert points. Private helper method; plz discuss before use
     * 
     * @param {int} journey_id - Journey primary key
     * @param {Point[]} points - points to insert
     * @param {Connection} conn - MariaDB connection
     */
    async insertPoints(journey_id, points, conn) {
        // insert points
        const length = points.length;
        for (let i = 0; i < length; ++i) {
            let point = points[i]; 

            // we have to concatenate the POINT to get the placeholder value in
            const sql = "INSERT INTO `tbl_points` (`id_journeys`, `point_num`, `loc`) \
                    VALUES (:id, :point_num, ST_PointFromText( ( CONCAT('POINT(', :lng,\
                            ' ', :lat, ')') ),'4326'))"

            let res_p = await conn.query(
                {
                    namedPlaceholders: true,
                    sql: sql
                },
                {
                    id: journey_id, 
                    point_num: point.point_num, 
                    lng: point.loc.lng, 
                    lat: point.loc.lat, 
                }
            );
        }
    }

    /**
     * Create new Journey record
     * 
     * @param {Journey} journey - the journey to insert
     * 
     * @returns status of connection
     * @throws database errors
     */
    async create(journey) {
        let res;
        const conn = await this.pool.getConnection();

        try {
            
            await conn.beginTransaction();

            // insert journey
            const sql = "INSERT INTO `tbl_journeys` (`forename`, `surname`,\
                        `video_link`, `desc_en`, `desc_es`, `desc_el`,\
                        `desc_it`, `desc_no`, `desc_bg`)\
                        VALUES (:forename, :surname, :video_link,\
                        :d_en, :d_es,:d_el, :d_it, :d_no, :d_bg)";
            res = await conn.query(
                {
                    namedPlaceholders: true,
                    sql: sql
                },
                {
                    forename: journey.forename,
                    surname: journey.surname,
                    video_link: journey.video_link,
                    d_en: (journey.description.en ? journey.description.en : ""),
                    d_es: (journey.description.es ? journey.description.es : ""),
                    d_el: (journey.description.el ? journey.description.el : ""),
                    d_it: (journey.description.it ? journey.description.it : ""),
                    d_no: (journey.description.no ? journey.description.no : ""),
                    d_bg: (journey.description.bg ? journey.description.bg : ""),
                }
            );

            await this.insertPoints(res.insertId, journey.points, conn);
           
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            if (conn) conn.end();
        }

        return res;
    }

    /**
     * Read a Journey
     * 
     * @param {Number} id - Primary key, must be positive integer
     * 
     * @returns {Journey} - Journey object, or null if nothing found
     * @throws database errors
     */
    async read(id) {
        const conn = await this.pool.getConnection();
        const journey = new Journey();

        try {
            // get journey
            let sql = "SELECT `forename`, `surname`, `video_link`, `desc_en`,\
                        `desc_es`, `desc_bg`, `desc_el`, `desc_no`, `desc_it`\
                        FROM `tbl_journeys` WHERE `id_journeys` = ?";
            let res_j = await conn.query(sql, id);
            if (res_j.length === 0) return null; // not found

            journey.forename = res_j[0].forename;
            journey.surname = res_j[0].surname;
            journey.video_link = res_j[0].video_link;
            journey.id = id;

            journey.addDescription({
                en: res_j[0].desc_en,
                es: res_j[0].desc_es,
                el: res_j[0].desc_el,
                bg: res_j[0].desc_bg,
                it: res_j[0].desc_it,
                no: res_j[0].desc_no
            })

            // get points
            sql = "SELECT `id_points`, `point_num`, `loc` FROM `tbl_points` WHERE `id_journeys` = ?";
            let res_p = await conn.query(sql, id);

            // add the points to the journey
            let num_points = res_p.length;
            for (let i = 0; i < num_points; ++i) {
                let p = res_p[i];

                let point = new Point(
                    id, 
                    p.point_num,
                    {
                        lng: p.loc.coordinates[0],
                        lat: p.loc.coordinates[1]
                    },
                );

                point.id_points = p.id_points;

                journey.addPoint(point);
               
            }

        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }

        return journey;
    }

    /**
     * Update a Journey. 
     * 
     * @param {int} id - Primary key
     * @param {Journey} journey - Journey to update
     * 
     * @returns status of connection
     * @throws database errors; journey not found
     */
    async update(id, journey) {
        let res;
        const conn = await this.pool.getConnection();

        try {  
            await conn.beginTransaction();

            // update journey
            let sql = "UPDATE `tbl_journeys` SET `forename` = :forename,\
                        `surname` = :surname, `video_link` = :video_link,\
                        `desc_en` = :d_en, `desc_es` = :d_es, `desc_el` = :d_el,\
                        `desc_it` = :d_it, `desc_no` = :d_no, `desc_bg` = :d_bg\
                        WHERE `id_journeys` = :id_journeys";

            res = await conn.query(
                {
                    namedPlaceholders: true,
                    sql: sql
                },
                {
                    id_journeys: id,
                    forename: journey.forename,
                    surname: journey.surname,
                    video_link: journey.video_link,
                    d_en: (journey.description.en ? journey.description.en : ""),
                    d_es: (journey.description.es ? journey.description.es : ""),
                    d_el: (journey.description.el ? journey.description.el : ""),
                    d_it: (journey.description.it ? journey.description.it : ""),
                    d_no: (journey.description.no ? journey.description.no : ""),
                    d_bg: (journey.description.bg ? journey.description.bg : ""),
                }
            );

            if (res.affectedRows === 0) throw new Error('Journey not found');

            sql = "DELETE FROM `tbl_points` WHERE `id_journeys` = ?";
            res = await conn.query(sql, id);
            await this.insertPoints(id, journey.points, conn);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            if (conn) conn.end();
        }

        return res;
    }

    /**
     * Delete a Journey
     * 
     * @param {int} id - Primary key
     * 
     * @returns status of connection
     * @throws database errors
     */
    async delete(id) {
        let res;
        const conn = await this.pool.getConnection();

        try {
            let sql = "DELETE FROM `tbl_journeys` WHERE `id_journeys` = ?"
            res = await conn.query(sql, id);
        } catch (err) {
            throw err
        } finally {
            if (conn) conn.end();
        }

        return res;
    }


    /**
     * Read all journeys. This will return all journeys, but each journey will 
     * only have the first point attached, or no points if non exist.
     * 
     * @return {[Journey]} Array of Journeys
     */
    async readAll() {
        let res;
        const conn = await this.pool.getConnection();

        try {
            let sql = "SELECT `tbl_journeys`.`id_journeys`, `tbl_journeys`.`forename`,\
                        `tbl_journeys`.`surname`, `tbl_points`.`point_num`,\
                        `tbl_points`.`loc`, `tbl_journeys`.`video_link`,\
                        `tbl_journeys`.`desc_en`, `tbl_journeys`.`desc_es`,\
                        `tbl_journeys`.`desc_el`, `tbl_journeys`.`desc_it`,\
                        `tbl_journeys`.`desc_no`, `tbl_journeys`.`desc_bg`\
                        FROM `tbl_journeys`\
                        LEFT JOIN `tbl_points` ON `tbl_journeys`.`id_journeys` = `tbl_points`.`id_journeys`\
                        WHERE `point_num` = 1 OR `point_num` IS NULL";
            res = await conn.query(sql);
        } catch (err) {
            throw err
        } finally {
            if (conn) conn.end();
        }

        let journeysReturn = [];
        res.forEach( (j) => {
            const journey = new Journey(j.forename, j.surname, j.video_link, j.id_journeys);

            journey.addDescription({
                en: j.desc_en,
                es: j.desc_es,
                el: j.desc_el,
                bg: j.desc_bg,
                it: j.desc_it,
                no: j.desc_no
            });

            // if a point exists
            if (j.point_num !== null) {
                let point = new Point(
                    j.journey_id, 
                    j.point_num,
                    {
                        lng: j.loc.coordinates[0],
                        lat: j.loc.coordinates[1]
                    },
                );

                journey.addPoint(point);
            }

            journeysReturn.push(journey);
        })

        return journeysReturn;    
    }
}

module.exports = JourneyModel;
