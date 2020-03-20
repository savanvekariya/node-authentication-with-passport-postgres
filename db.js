const pg = require('pg')
//const config = require('../config')
const winston = require('winston')

const dbConfig = {
	user: "postgres",
	password: "postgres",
	database: "postgres",
	host: "localhost",
	port: 5432,
	
}

const pool = new pg.Pool(dbConfig)
pool.on('error', function (err) {
	winston.error('idle client error', err.message, err.stack)
})

module.exports = {
	pool,
	query: (text, params, callback) => {
		return pool.query(text, params, callback)
	}
}