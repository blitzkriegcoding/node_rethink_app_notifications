const rtdb = require('rethinkdb');
const db = require('./index');

const pollObject = new db();

module.exports = (socket) => {
	pollObject.connectToDb((err, connection) => {
		if(err)	
		{
			return callback(true, "Error connecting to database");
		}

		rtdb.table('poll').changes().run(connection, (error, cursor) => {
			if(err)
			{
				console.log(err);
			}
			cursor.each((err, row) => {
				console.log(JSON.stringify(row));
				if(Object.keys(row).length > 0){
					socket.broadcast.emit("changeFeed", {"id": row.new_val.id, "polls": row.new_val.polls});
				}
			})
		})
	})
}