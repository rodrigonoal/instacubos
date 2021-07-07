const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        database: 'instacubos',
        password: 'password',
        port: 5432
    }
});


module.exports = {
    knex
}