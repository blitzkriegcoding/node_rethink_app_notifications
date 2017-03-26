'use strict';

const rtdb = require('rethinkdb');
const async = require('async');

class database {    
    setupDb()
        {
            const self = this;
            async.waterfall([(callback) => {
                self.connectToRtDBServer( (err, connection) => {
                    if(err) return callback(true, `Connection refused: ${err}`);

                    callback(null, connection);
                    })
                }, 
                (connection, callback) => {
                    rtdb.dbCreate('polls').run(connection, function(err, result) 
                    {
                        if(err)
                        {
                            console.log(`Database already created`);
                        }
                        else
                        {
                            console.log("Database successfully created");                        
                        }
                        callback(null, connection);
                    })
                },
                (connection, callback) => {
                    rtdb.db('polls').tableCreate('poll').run(connection, function(err, result) {
                        connection.close();
                        if(err) 
                        {
                            console.log("Table already created"); 
                            
                        }
                        else
                        {
                            console.log("Table succesfully created");                        
                            
                        }
                        callback(null, "Database is setup successfully");
                    })
                }
            ], (err, data) => {
                console.log(data);
            })
        }
    connectToRtDBServer(callback)
    {
        rtdb.connect({
            host: 'localhost',
            port: 28015
        }, (err, connection) => {
            callback(err, connection)

        });
    }
    
    connectToDb(callback)
    {
        rtdb.connect({
            host: 'localhost',
            port: 28015,
            db: 'polls'
        }, (err, connection) => {
            callback(err, connection);
        });
    }
}

module.exports = database;