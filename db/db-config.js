const mysql = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		port: 3306,
		user: 'root',
		password: '',
		database: 'productos'
	},
	pool: { min: 2, max: 8 }
});

const sqlite = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './db/mydatabase.chat'
	},
	pool: { min: 2, max: 8 }
});

mysql.schema
	.createTableIfNotExists('productos', function(table) {
		table.increments('id').primary();
		table.string('title', 100);
		table.float('price');
		table.string('thumbnail').defaultTo('');
	})
	.then(() => {
		console.log('Tabla Productos');
	})
	.catch((err) => {
		throw err;
	});

sqlite.schema
	.createTableIfNotExists('chat_msg', function(table) {
		table.increments('id').primary();
		table.string('email', 128);
		table.string('message');
		table.string('date');
	})
	.then(() => {
		console.log('Tabla Chat');
	})
	.catch((err) => {
		throw err;
	});

module.exports = {mysql, sqlite};
