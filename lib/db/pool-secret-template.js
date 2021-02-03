const mariadb = require('mariadb');

// Update this with actual production values.
// DO NOT COMMIT PRODUCTION SECRETS TO GIT
const pool = mariadb.createPool({
    host: '127.0.0.1', 
    user:'root', 
    password: '',
    connectionLimit: 5
});

module.exports = pool;