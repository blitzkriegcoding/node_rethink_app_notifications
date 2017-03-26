const express = require('express');
const router = express.Router();
const IndexCtrl = require('../controllers/home');
const PollsCtrl = require('../controllers/polls');


router.get('/index', IndexCtrl.home);
router.get('/polls', PollsCtrl.getAllPolls);
router.post('/poll', PollsCtrl.addNewPolls);
router.put('/poll', PollsCtrl.votePollOption);


module.exports = router;
