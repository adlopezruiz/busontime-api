const express = require('express');
const router = express.Router();
const { getStops, getStop, addStop, deleteStop, updateStop } = require('../controllers/busStopController');
const authenticateToken = require('../middlewares/firebaseAuth');

//User authenticateToken middleware
router.use(authenticateToken);

//Routes

router.get('/:stopId', getStop);

router.get('/', getStops);

router.post('/', addStop);

router.put('/:stopId', updateStop);

router.delete('/:stopId', deleteStop);

module.exports = router;