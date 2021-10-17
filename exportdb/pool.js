const mariadb = require('mariadb');

// Update this with actual production values.
// DO NOT COMMIT PRODUCTION SECRETS TO GIT
const pool = mariadb.createPool({
    host: 'mamumi_mariadb', 
    user: 'root', 
    password: '',
    connectionLimit: 50,
    database: 'mamumi_dump'
});

module.exports = {
    getConnection() {
      return new Promise(function (res, rej) {
        pool.getConnection()
          .then(function (conn) {
            res(conn);
          })
          .catch(function (error) {
            rej(error);
          });
      });
    }
  };