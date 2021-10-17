
class SessionModel {


    /**
     * Session Model.
     * 
     * @param {lowdb} db Lowdb instance 
     */
     constructor(db) {
        db.defaults({ sessions: [] });
        this.db = db;
    }

    /**
     * 
     * @return {number} Session key number
     */
    async create() {
        const maxBigInt = 18446744073709551615; // 2^64
        let isUnique = false;
        let sessionKey;
        while (!isUnique) {
            sessionKey = Math.floor((Math.random() * maxBigInt));
            const res = await this.db.get('sessions')
                                    .find({ key: sessionKey })
                                    .value();
            if (res === undefined) isUnique = true;
        }
        const session = {
            key: sessionKey,
            lastAccess: Date.now()
        }
        this.db.get('sessions').push(session).write();
        return sessionKey;
    }

    async read(sessionKey) {
        return await this.db.get('sessions')
                            .find({ key: sessionKey })
                            .value();
    }

    async update(sessionKey) {
        return await this.db.get('sessions')
                            .find({ key: sessionKey })
                            .assign({ key: sessionKey, lastAccess: Date.now() })
                            .write();
    }

    async delete(sessionKey) {
        return await this.db.get('sessions')
                            .find({ key: sessionKey })
                            .remove()
                            .write();
    }
}

module.exports = SessionModel;