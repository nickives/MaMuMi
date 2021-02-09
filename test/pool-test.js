const mariadb = require('mariadb');


const pool = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: '',
    connectionLimit: 5,
    acquireTimeout: 1000,
    database: 'mamumi',
    connectTimeout: 1000,
    socketTimeout: 5000
});

module.exports = {
    async getConnection() {
      return await pool.getConnection();
  },

  async end() {
    return await pool.end();
  }
}