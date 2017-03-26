'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const router = require('./routes/index');
const db = require('./models/index');
const io = require('socket.io')(http);
let feed;
// On connection to the socket, just invoking the function.
io.on('connection',function(socket) {
  feed = require('./models/Feed')(socket);
});


const dbModel = new db();
dbModel.setupDb();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/view'));
app.use('/', router);

http.listen(3000, () => {
	console.log("Listening on port 3000");
})
