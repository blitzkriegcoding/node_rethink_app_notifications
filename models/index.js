'use strict';

const rtdb = require('rethinkdb');
const async = require('async');

class db {
	setupDb(){
		const self = this;
		async.waterfall([ (callback) =>{
			self.connectToRtDBServer((err, connection) => {
				if(err) return callback(true, `Connection refused: ${err}`);

				callback(null, connection);
			});
		}, (connection, callback) => {
			rtdb.dbCreate('polls').run(connection, (err, result) => {
				if(err) return console.log(`Database already created ${err}`);

				console.log("Database successfully created");
				callback(null, connection);

			},
			(connection, callback) => {
				rtdb.db('polls').tableCreate('poll').run(connection, (err, result) => {
					connection.close();
					if(err) return console.log(`Error: ${err}`);

					console.log("Table succesfully created");

					callback(null, "Database is setup successfully");

				})
			}
		);
		}

		]);
	}
}
