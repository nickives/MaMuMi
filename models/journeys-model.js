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
            let sql = "INSERT INTO `tbl_points` (`id_journeys`, `point_num`, `loc`,\
                                                `arrival_date`, `departure_date`,\
                                                `video_link`, `desc_en`, `desc_es`,\
                                                `desc_de`, `desc_fr`)\
                    VALUES (:id, :point_num, ST_PointFromText( ( CONCAT('POINT(', :lng,\
                            ' ', :lat, ')') ),'4326'), :arrive_date, :depart_date, :video,\
                            :d_en, :d_es,:d_de, :d_fr)"

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
                    arrive_date: point.arrival_date, 
                    depart_date: point.departure_date, 
                    video: point.video_link,
                    d_en: (point.description.en ? point.description.en : ""),
                    d_es: (point.description.es ? point.description.es : ""),
                    d_de: (point.description.de ? point.description.de : ""),
                    d_fr: (point.description.fr ? point.description.fr : ""),
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
            let sql = "INSERT INTO `tbl_journeys` (`forename`, `surname`) VALUES (?, ?)";
            res = await conn.query(sql, [journey.forename, journey.surname]);

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
            let sql = "SELECT `forename`, `surname` FROM `tbl_journeys` WHERE `id_journeys` = ?";
            let res_j = await conn.query(sql, id);
            if (res_j.length === 0) return null;

            journey.forename = res_j[0].forename;
            journey.surname = res_j[0].surname;
            journey.id = id;

            // get points
            sql = "SELECT `id_points`, `point_num`, `loc`, `arrival_date`,\
                           `departure_date`, `video_link`, `desc_en`, `desc_es`,\
                           `desc_de`, `desc_fr`\
                           FROM `tbl_points`\
                   WHERE `id_journeys` = ?";
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
                    p.video_link,
                    p.arrival_date,
                    p.departure_date,
                );

                point.addDescription({
                    en: p.desc_en,
                    es: p.desc_es,
                    de: p.desc_de,
                    fr: p.desc_fr,
                })
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
            let sql = "UPDATE `tbl_journeys` SET `forename` = ?, `surname` = ? WHERE `id_journeys` = ?"
            res = await conn.query(sql, [journey.forename, journey.surname, id]);
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
            let sql = "SELECT `tbl_journeys`.`id_journeys`, `forename`, `surname`,\
                       `point_num`, `loc`, `arrival_date`, `departure_date`,\
                       `video_link`, `desc_en`, `desc_es`, `desc_de`, `desc_fr`\
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
            let journey = new Journey(j.forename, j.surname, j.id_journeys);

            // if a point exists
            if (j.point_num !== null) {
                let point = new Point(
                    j.journey_id, 
                    j.point_num,
                    {
                        lng: j.loc.coordinates[0],
                        lat: j.loc.coordinates[1]
                    },
                    j.video_link,
                    j.arrival_date,
                    j.departure_date,
                );

                point.addDescription({
                    en: j.desc_en,
                    es: j.desc_es,
                    de: j.desc_de,
                    fr: j.desc_fr,
                });

                journey.addPoint(point);
            }

            journeysReturn.push(journey);
        })

        return journeysReturn;    
    }
}

module.exports = JourneyModel;
