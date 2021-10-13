
class SessionModel {

    /**
     * Session Model. This is used to validate login 
     * 
     * @param {mariadb.Pool} pool database connection pool
     */
    constructor(pool) {
        this._pool = pool;
    }

    /**
     * 
     * @return {Number} Session key number
     */
    async create() {
        const conn = await this._pool.getConnection();
        let res;

        const maxBigInt = 18446744073709551615; // 2^64
        let sessionKey = Math.floor((Math.random() * maxBigInt));
        try {
            const sql = "INSERT INTO `tbl_sessions` (`session_key`) VALUES (?)";

            await conn.query(
                {
                    sql: sql,
                    supportBigInt: true
                }, 
                sessionKey
                );

        } catch (err) {
            // Duplicate key - there's a 1/2^64 chance this can happen, so just try again.
            if (err.errno === 1062) {
                sessionKey = this.create();
            } else {
                throw err;
            }
        } finally {
            if (conn) conn.end();
        }
        return sessionKey;
    }

    async read(sessionKey) {
        const sql = "SELECT `last_access` FROM `tbl_sessions` WHERE `session_key` = ?";
        let res, conn;
        try {
            conn = await this._pool.getConnection();
            res = await conn.query(sql, sessionKey);
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
        return res;
    }

    async update(sessionKey) {
        const sql = "UPDATE `tbl_sessions` SET `last_access` = NOW() WHERE `session_key` = ?";
        let res, conn;
        try {
            conn = await this._pool.getConnection();
            res = await conn.query(sql, sessionKey);
        } finally {
            if (conn) conn.end();
        }
        return res;
    }

    async delete(sessionKey) {
        const sql = "DELETE FROM `tbl_sessions` WHERE `session_key` = ?";
        try {
            conn = await this._pool.getConnection();
            res = await conn.query(sql, accessTime, sessionKey);
        } finally {
            if (conn) conn.end();
        }
        return res;        
    }

    checkTimeLimit(lastAccess) {

    }
}

module.exports = SessionModel;