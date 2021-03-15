require('../server/config/config');

const config = {
    dbpgsql: {
        user: process.env.USR,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.PWRD,
        port: process.env.DBPORT,
    },
}

module.exports = {config};