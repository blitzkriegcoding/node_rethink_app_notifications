'use strict'
const rtdb 	= require('rethinkdb');
const db 	= require('../models/index');
const Poll = require('../models/Poll');

function getAllPolls(req, res)
{
	let pollObj = new Poll();
	pollObj.getAllPolls(function(err, pollResponse){
		if(err)
		{
			return res.json({"responseCode": 1, "responseDesc": pollResponse});
		}

		res.send({responseCode : 0, responseDesc : "Success", data : pollResponse});
	});
}

function addNewPolls(req, res)
{
	let pollObj = new Poll();
	pollObj.addNewPolls(req.body, (err, pollResponse) => {
		if(err)
		{
			return res.send({responseCode: 1, responseDesc: pollResponse});
		}
		res.send({responseCode: 0, responseDesc: "Success", data: pollResponse});
	});
}

function votePollOption(req, res)
{
	let pollObj = new Poll();
	pollObj.votePollOption(req.body, (err, pollResponse) => {
		if(err)
		{
			return res.send({responseCode: 1, responseDesc: pollResponse});
		}

		res.send({responseCode: 0, responseDesc: "Success", data: pollResponse});
	});
}

module.exports = {
getAllPolls,
addNewPolls,
votePollOption
}