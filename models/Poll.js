'use strict';

const rtdb 	= require('rethinkdb');
const database 	= require('./index');
const async = require('async');

class Poll {
	addNewPolls(pollData, callback)
	{
		async.waterfall([
				function(callback) {
					const db = new database();
					db.connectToDb((err, connection) => {
						if(err)
						{
							return callback(true, "Error connecting to DB");
						}
						callback(null, connection);
					});
				},
				function(connection, callback) {
					rtdb.table('poll').insert({
						'question': pollData.question,
						'polls': pollData.polls
					}).run(connection, (err, result) => {
						connection.close();
						if(err)
						{
							return callback(true, 'Error happens while adding new polls');
						}
						callback(null, result);
					});
				}
			], function(err, data) {
				callback(err === null ? false:true, data);
			});
	}

	votePollOption(pollData, callback)
	{
		const db = new database();
		async.waterfall([
				(callback) => {
					db.connectToDb((err, connection) => {
						if(err)
						{
							return callback(true, "Error connecting database");
						}
						callback(null, connection);
					});
				},
				(connection, callback) => {
					rtdb.table('poll').get(pollData.id).run(connection, (err,result) => {
						if(err)
						{
							return callback(true, "Error fetching polls to database");
						}
						for(var pollCounter = 0; pollCounter < result.polls.length; pollCounter++)
						{
							if(result.polls[pollCounter].option === pollData.option)
							{
								result.polls[pollCounter].vote += 1;
								break;
							}
						}
						rtdb.table('poll').get(pollData.id).update(result).run(connection, (err, result) => {
							connection.close();
							if(err)
							{
								return callback(true, `Error update the vote ${err} `);
							}
							callback(null, result);
						});						
					});					
				},

			], (err, data) => {
				callback(err === null ? false : true, data);
			});
	}

	getAllPolls(callback)
	{		
		async.waterfall([ function(callback) {
				const db = new database();
				db.connectToDb(function(err, connection){
					if(err)
					{
						return callback(true, "Error connecting database");
					}
					callback(null, connection);
				})
			},
			function(connection, callback) {
				rtdb.table('poll').run(connection, function(err, cursor) {
					connection.close();
					if(err)
					{
						return callback(true, "Error fetching polls to database");
					}
					cursor.toArray(function(err, result){
						if(err)
						{
							return callback(true, "Error reading cursor");
						}

						callback(null, result);
					});

				});
			}], function(err, data) {

			callback(err === null ? false : true, data);
		});
	}

}

module.exports = Poll;