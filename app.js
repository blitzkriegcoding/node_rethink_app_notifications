'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const router = require('./routes/index');
const db = require('./models/index');

const dbModel = new db();

dbModel.setupDb();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', router);

http.listen(3000, () => {
	console.log("Listening on port 3000");
})
