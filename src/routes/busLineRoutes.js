const express = require('express');
const router = express.Router();
const { getLines, getLine, createNewLine, updateLine, deleteLine, getTodaySchedule} = require('../controllers/busLineController');
const authenticateToken = require('../middlewares/firebaseAuth');

//User authenticateToken middleware
router.use(authenticateToken);

//Routes

//This one route have to pass query params! lineId, stopName, destination
router.get('/todaySchedule', getTodaySchedule);

router.get('/:lineId', getLine);

router.get('/', getLines);

router.post('/', createNewLine);

router.put('/:lineId', updateLine);

router.delete('/lineId', deleteLine);

module.exports = router;