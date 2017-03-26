const express = require('express');
const router = express.Router();
const IndexCtrl = require('../controllers/home');
const PollsCtrl = require('../controllers/polls');


router.get('/index', IndexCtrl.home);

module.exports = router;
